import {NextRequest, NextResponse} from "next/server";
import {getAccessToken, getBearerToken, getRefreshToken} from "@/backend/Hellpers/Utils";

export default function middleware(req: NextRequest) {
    console.log('Middleware', req.nextUrl.pathname, req.url)
    const accessToken = getAccessToken(req)
    // const pathname = req.nextUrl.pathname
    //
    // if(!accessToken && pathname === '/login') {
    //     return NextResponse.next()
    // }
    //
    // if(accessToken) {
    //
    // } else {
    //
    // }

    const user = false
    if(req.nextUrl.pathname === "/") {
        return Response.redirect(new URL(user ? '/dashboard' : '/login', req.url))
    }

    if(!user && req.nextUrl.pathname !== '/login') {
        return Response.redirect(new URL('/login', req.url))
    }

    if(user && req.nextUrl.pathname.startsWith('/login')) {
        return Response.redirect(new URL('/dashboard', req.url))
    }

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)', '/api/'],
}