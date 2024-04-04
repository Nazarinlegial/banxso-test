import {NextRequest} from "next/server";
import {cookies} from 'next/headers'

export function getBearerToken(req: NextRequest) {
    return req.headers.get("authorization")?.split(' ')[1];
}

export function getRefreshToken(req: NextRequest) {
    return cookies().get('refreshToken')?.value
}

// export function getAccessToken(req: NextRequest) {
//     const headerToken = getBearerToken(req)
//     const cookieToken = cookies().get('accessToken')?.value
//     return headerToken || cookieToken
// }

export function getAccessToken() {
    return cookies().get('accessToken')?.value
}

export function setCookieToken(token:string, nameCookie: 'accessToken' | 'refreshToken') {
    cookies().set({
        name: nameCookie,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + (1000 * 60 * 60 * 24 * 15),
        // sameSite:process.env.NODE_ENV === 'production' ? 'strict' : 'none'
    })
}


export function removeToken(name: 'accessToken' | 'refreshToken') {
    cookies().delete(name)
}