import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export default function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl
    // Якщо відкрівають базову сторінку перенаправляємо на дашборд
    if(pathname === "/") return Response.redirect(new URL('/dashboard', req.url))

}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\\\.png$).*)']
}