import {NextRequest, NextResponse} from "next/server";
import {getAccessToken, getRefreshToken} from "@/backend/Hellpers/Utils";
import {tokenService} from "@/backend/Services/token.service";
import {InvalidAccessToken, InvalidRefreshToken} from "@/backend/Services/exception.service";
import {IAccessPayload, IRefreshPayload, jwtService} from "@/backend/Services/jwt.service";
import {userQuery} from "@/db/query";
import {ObjectId} from "bson";
import {setCookieToken} from "@/backend/Hellpers/Utils/headers";
import {cookies} from "next/headers";

export async function GET(req: NextRequest) {
    console.log('Next valid token')
    const accessToken = getAccessToken() || ""
    const transformToken = accessToken.replace(" ", "")


    try {
        console.log('accessToken Valid', transformToken)
        const payload: IAccessPayload = await jwtService.verifyAccessToken(transformToken)
        return NextResponse.json(payload)
    } catch (error) {
        if(error instanceof InvalidAccessToken) {
            console.log('!Middleware bad token!')
            const refreshToken = req.cookies.get("refreshToken")?.value || ""
            try {
                const payload: IRefreshPayload = await jwtService.verifyRefreshToken(refreshToken)
                const user = await userQuery.getUser(new ObjectId(payload.user_id))

                if(!user) throw new InvalidRefreshToken()
                const newRefreshToken = await tokenService.saveRefreshToken(user._id!)
                const newAccessToken = jwtService.createAccessToken({
                    user_id: new ObjectId(user._id).toString(),
                    role: user.role,
                    profile: {
                        email: user.profile.mail,
                        name: user.profile.displayName
                    }
                })

                console.log('newToken', newAccessToken)

                cookies().delete('accessToken')
                cookies().delete('refreshToken')

                setCookieToken(newAccessToken, 'accessToken')
                setCookieToken(newRefreshToken, 'refreshToken')

                const body = {
                    accessToken,
                    refreshToken,
                    ...user
                }

                return NextResponse.json(body, {status: 201})


            } catch (error) {
                if (error instanceof InvalidRefreshToken) {
                    console.log('Більше')
                    req.cookies.delete('accessToken')
                    req.cookies.delete('refreshToken')

                    cookies().delete('accessToken')
                    cookies().delete('refreshToken')

                    return NextResponse.json({
                        message: 'Відмовленно в доступі!'
                    }, {
                        status: 401
                    })
                }
            }



        }
    }

    return NextResponse.json({lol: 'lol'},{
        status: 200
    })
}