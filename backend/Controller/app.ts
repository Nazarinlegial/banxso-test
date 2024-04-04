import {NextRequest, NextResponse} from "next/server";
import {createURI, getAccessToken} from "@/backend/Hellpers/Utils";
import {allowedPath, protectedPath} from "@/backend/Common/Constant";
import {tokenService} from "@/backend/Services/token.service";
import {IAccessPayload, jwtService} from "@/backend/Services/jwt.service";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {InvalidAccessToken} from "@/backend/Services/exception.service";
import {BaseController} from "@/backend/Controller/base";
import {IMailResponse} from "@/backend/Common/Interface";

export class AppController extends BaseController {

    // async allowedPath() {
    //     for(const allowed of allowedPath) {
    //         // Шукаємо схожі шляхи в списку доступниї
    //
    //         if (this._pathname.startsWith(allowed)) {
    //             console.log('Парк', this._pathname, this._pathname.startsWith(allowed))
    //             return NextResponse.next()
    //         }
    //     }
    // }

    async protectedPath(token: string, req: NextRequest) {
        try {
            for (const protect in protectedPath) {
                if (req.nextUrl.pathname.startsWith(protect)) {
                    const payload = await jwtService.verifyAccessToken(token)
                    if (!protectedPath[protect].includes(payload.role)) return NextResponse.json({
                        message: 'Немає доступу.'
                    }, {
                        status: 403
                    })
                }
            }

        } catch (error) {
            if (error instanceof InvalidAccessToken) return NextResponse.json({message: 'Не авторизований.'}, {status: 401})
            return NextResponse.error()
        }
    }

    async isProtected(req: NextRequest) {
        const accessToken = getAccessToken()
        console.log('cookie acc', accessToken)
        return await this.protectedPath(accessToken || "", req)
    }


    async getMail(req: NextRequest) {
        console.log("PRIVET")
        await this.isProtected(req)

        const pages = parseInt(req.nextUrl.searchParams.get('page') || "") - 1 && 0
        const take = parseInt(req.nextUrl.searchParams.get('page') || "") && 15
        const skip = pages * take

        const client = await this.getGraphClient(req)
        const query = encodeURIComponent(`$top=${take}&$skip=${skip}&$count=true`)

        console.log('client', client)

        const messages: IMailResponse = await client?.api(`/me/messages`)
            .top(take)
            .skip(skip)
            .count(true)
            .get()

        console.log('Route mesages', messages)

        return NextResponse.json(JSON.stringify({'messages': 'wqwqw'}) , {
            status: 200
        })
    }

}

export const appController = new AppController()