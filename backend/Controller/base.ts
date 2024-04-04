import {MS_SCOPES, msalClient} from "@/backend/Services/msal.service";
import {getAuthenticatedGraphClient} from "@/backend/Services/api-graph.service";
import {createURI, getAccessToken} from "@/backend/Hellpers/Utils";
import {MS_REDIRECT_PATH} from "@/config/msal.config";
import {NextRequest, NextResponse} from "next/server";
import {InvalidAccessToken} from "@/backend/Services/exception.service";
import {jwtService} from "@/backend/Services/jwt.service";
import {accountQuery} from "@/db/query";


export class BaseController {
    constructor(protected msClient = msalClient) {}
    protected _SCOPES:string[] = MS_SCOPES

    private async getAccount() {
        const accessToken = getAccessToken()
        console.log('Token null', accessToken )
        try {
            const payload = await jwtService.verifyAccessToken(accessToken!)
            return accountQuery.getAccount({userId: payload.userId})

        } catch (error) {
            if (error instanceof  InvalidAccessToken) {
                return NextResponse.json({message: 'Не авторизован!'})
            }
        }

    }

    protected async getGraphClient(req: NextRequest) {
        try {
            const account = await this.getAccount()
            console.log('ACOUNT', account)

            if(account && 'ms_account' in account) {
                return getAuthenticatedGraphClient({
                    msalClient: this.msClient,
                    userId: account.user_account_id,
                    redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
                })
            }
        } catch (e) {
            console.log('error', e)
        }

    }

    protected async initGraphClient(homeAccountId:string, req: NextRequest) {
        return  getAuthenticatedGraphClient({
            msalClient: this.msClient,
            userId: homeAccountId,
            redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
        })
    }
}