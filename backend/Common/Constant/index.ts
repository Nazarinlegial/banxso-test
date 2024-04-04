export enum ROLE {
    ADMIN = 'admin',
    USER = 'user'
}


// Шляхи для яких потрібно бути авторизованим
// Для привильної валідації потрібно від великих до батькіських шляхів
export const protectedPath: {[key:string]: string[]} = {
    "/dashboard/create": [ROLE.ADMIN],
    "/dashboard": [ROLE.USER, ROLE.ADMIN],
    "/admin": [ROLE.ADMIN],
    "/api/admin/list": [ROLE.ADMIN],
    "/api/admin/role": [ROLE.ADMIN],
    // "/api/mail/messages": [ROLE.USER, ROLE.ADMIN],
    "/api/mail/send": [ROLE.ADMIN],
}


export const allowedPath = [
    "/login",
    "/api/auth"
]