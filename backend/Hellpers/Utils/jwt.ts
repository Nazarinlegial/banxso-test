import {v4 as uuid} from "uuid";
import {IAccessPayload, IJWTSecret} from "@/backend/Services/jwt.service";
import jwt from "jsonwebtoken";
import {InvalidAccessToken} from "@/backend/Services/exception.service";

export const JwtInit = function () {
    let _storage = generateSecret()

    function generateSecret(days: number = 1): IJWTSecret {
        return {
            secret: uuid().replace(/-/g, ''),
            expire: Date.now() + (1000 * (86_400 * days))
        } satisfies IJWTSecret
    }

    function isExpireStorage() {
        if (_storage.expire > Date.now()) return
        _storage = generateSecret()
    }

    return {
        verifyAccessToken: function (token: string): Promise<any> {
            return new Promise((resolve, reject) => {
                jwt.verify(token, _storage.secret, (error, decoded) => {
                    if (error) throw new InvalidAccessToken()
                    resolve(decoded)
                })
            })
        },
        createAccessToken: function (payload: IAccessPayload): string {
            isExpireStorage()
            return jwt.sign(
                payload,
                _storage.secret,
                {
                    expiresIn: '30m',
                })
        }
    }

}


export const accessJwt = JwtInit()
