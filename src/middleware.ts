import {NextRequest, NextResponse} from "next/server";
import {createURI, getAccessToken,  getRefreshToken} from "@/backend/Hellpers/Utils";
import {allowedPath, protectedPath} from "@/backend/Common/Constant";
import {InvalidAccessToken} from "@/backend/Services/exception.service";
import {cookies} from "next/headers";
import {IAccessPayload} from "@/backend/Services/jwt.service";

export default function middleware(req: NextRequest) {
    try {
        const [accessToken, refreshToken] = [getAccessToken(), getRefreshToken(req)]

        for (const allowed of allowedPath) {
            // Шукаємо схожі шляхи в списку доступниї
            if (req.nextUrl.pathname.startsWith(allowed)) {
                return NextResponse.next()
            }
        }

        if (!accessToken || !refreshToken) return NextResponse.redirect(createURI('/login', req.url))


        return fetch( createURI('/api/auth/valid-token', req.url),{
            headers: {
                Cookie: cookies().toString()
            },
        }).then(data => data.json())
            .then(json => {
                const payload: IAccessPayload = json
                for(const protect in protectedPath) {
                    if (req.nextUrl.pathname.startsWith(protect)) {
                        if(!protectedPath[protect].includes(payload.role)) return NextResponse.redirect(createURI('/dashboard', req.url))
                        return NextResponse.next()
                    }
                }

                if (req.nextUrl.pathname === '/') return NextResponse.redirect(createURI('/dashboard', req.url))
            })
            .catch(data => {
                console.log('Error valid token fetch', data)
            })

    } catch (error) {
        if (error instanceof InvalidAccessToken) {
            console.log('Middleware bad token!')

        }
    }


}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\\\.png$).*)']
}