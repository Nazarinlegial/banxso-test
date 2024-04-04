import {MS_REDIRECT_PATH} from "@/config/msal.config";
import {AuthorizationCodeRequest, AuthorizationUrlRequest} from "@azure/msal-node";
import {NextRequest} from "next/server";
import {createURI} from "@/backend/Hellpers/Utils";
import {accountQuery} from "@/db/query/account";
import {getAuthenticatedGraphClient} from "@/backend/Services/api-graph.service";
import {userQuery} from "@/db/query/user";
import {BaseController} from "@/backend/Controller/base";
import {tokenService} from "@/backend/Services/token.service";
import {ROLE} from "@/backend/Common/Constant";
import {setCookieToken} from "@/backend/Hellpers/Utils/headers";
import {WithId} from "mongodb";
import {UserCollection} from "@/db/schema/user";
import {BadRequestError} from "@/backend/Services/exception.service";
import {cookies} from "next/headers";
import {jwtService} from "@/backend/Services/jwt.service";
import {ObjectId} from "bson";

class AdminController extends BaseController {

    public async login(req: NextRequest) {
        const urlParams = {
            scopes: this._SCOPES,
            redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
        } satisfies AuthorizationUrlRequest

        console.log('Create URI', createURI(MS_REDIRECT_PATH!, req.url))
        try {
            const authUrl = await this.msClient.getAuthCodeUrl(urlParams)
            return Response.redirect(authUrl)
        } catch (error) {
            console.error("Error login api: ", error)
        }
    }


    public async redirect(req: NextRequest) {
        const url = new URL(req.url)
        const code = url.searchParams.get("code")

        const tokenRequest = {
            code: code!,
            scopes: this._SCOPES,
            redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
        } satisfies AuthorizationCodeRequest;

        try {
            const response = await this.msClient.acquireTokenByCode(tokenRequest)
            const account = await accountQuery.getAccount({accountId: response.account?.homeAccountId})

            if (!account) {
                console.dir(response, {depth: 4})
                const client = getAuthenticatedGraphClient({
                    msalClient: this.msClient,
                    userId: response.account?.homeAccountId!,
                    redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
                })
                const profile = await client.api('/me').select("mail").get()


                const user = await userQuery.addUser(profile)
                await accountQuery.addAccount(
                    user.insertedId,
                    response.accessToken,
                    response.account!
                )

                return await this.createTokens({
                    _id: user.insertedId,
                    role: ROLE.USER,
                    profile: profile
                })


            } else {

                await accountQuery.updateAccountCredentials(response.accessToken, response.account!)
                const user = await userQuery.getUser(account.user_id)
                if (!user) throw new BadRequestError("Не вірний запит, спробуйте пізніше.")
                console.log('Account User', user)
                return await this.createTokens(user)
            }


        } catch (error) {
            console.error("Error redirect api: ", error)
            return Response.redirect(createURI('/login?error_message=w', req.url))
        }
    }

    public async logout(req: NextRequest) {

    }

    public async acquireAccessToken() {

    }

    private async createTokens(user: WithId<UserCollection>) {
        cookies().delete('accessToken')
        cookies().delete('refreshToken')

        const accessToken = jwtService.createAccessToken({
            user_id: new ObjectId(user._id).toString(),
            role: user.role,
            profile:{
                email: user.profile.mail,
                name: user.profile.displayName
            }

        })
        const refreshToken = await tokenService.saveRefreshToken(user._id)

        setCookieToken(accessToken, 'accessToken')
        setCookieToken(refreshToken, 'refreshToken')

        // cookies().set({
        //     name: 'accessToken',
        //     value: accessToken,
        //     httpOnly: true,
        //     path: '/',
        //     secure: process.env.NODE_ENV === 'production',
        //     expires: Date.now() + (1000 * 60 * 60 * 24 * 15),
        //     // sameSite:process.env.NODE_ENV === 'production' ? 'strict' : 'none'
        // })
        // cookies().set({
        //     name: 'refreshToken',
        //     value: refreshToken,
        //     httpOnly: true,
        //     path: '/',
        //     secure: process.env.NODE_ENV === 'production',
        //     expires: Date.now() + (1000 * 60 * 60 * 24 * 15),
        //     // sameSite:process.env.NODE_ENV === 'production' ? 'strict' : 'none'
        // })

        return {
            accessToken,
            refreshToken
        }
    }
}

export default new AdminController()