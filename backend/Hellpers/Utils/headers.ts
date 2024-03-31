import {NextRequest} from "next/server";

export function getBearerToken(req: NextRequest) {
    return req.headers.get("authorization")?.split(' ')[1];
}

export function getRefreshToken(req: NextRequest) {
    return req.cookies.get("refreshToken")?.value
}

export function getAccessToken(req: NextRequest) {
    const headerToken = getBearerToken(req)
    const cookieToken = req.cookies.get('accessToken')?.value
    return headerToken || cookieToken
}