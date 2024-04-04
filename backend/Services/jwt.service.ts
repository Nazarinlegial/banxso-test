import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid';
import {InvalidAccessToken, InvalidRefreshToken, InvalidToken} from "@/backend/Services/exception.service";
import {accessJwt} from "@/backend/Hellpers/Utils/jwt";

type ITokenOptions = {
    key: string
}

export type IRefreshPayload = {
    user_id: string
}

export type IProfilePayload = {
    name: string,
    email?: string
}

export type IAccessPayload = {
    user_id: string
    role: string
    profile: IProfilePayload
}


export type IJWTSecret = {
    secret: string,
    expire: number
}


class JwtService {
    protected _expireAccess = '30m'
    private _expireRefresh = '21d'
    // protected _storage: IJWTSecret
    protected _daylightTimeSecond = 86_400

    // При ініціалізації классу стрворюємо локальний стор с секретом для JWT Токенів доступу
    //
    // constructor() {
    //     // Генеруємо секрет для створення токену пропуску
    //     this._storage = this.generateSecret()
    // }

    // generateSecret(days:number = 1): IJWTSecret {
    //     return {
    //         secret: uuid().replace(/-/g, ''),
    //         expire: Date.now() + (1000 * (this._daylightTimeSecond * days))
    //     } satisfies IJWTSecret
    // }

    // Перевіряємо чи не старий секрет, якщо старий обновлюємо його
    // private isExpireStorage() {
    //     if (this._storage.expire > Date.now()) return
    //     this._storage = this.generateSecret()
    // }

    // async verify (token: string, key: jwt.Secret): Promise<any>  {
    //     return new Promise((resolve, reject)=> {
    //         jwt.verify(token, key, (error, decoded) => {
    //             if (error) throw new InvalidToken(`Invalid verify token | ErrorJWT - ${error.message}`)
    //             resolve(decoded)
    //         })
    //     })
    // }

    createRefreshToken(payload: IRefreshPayload) {
        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            {
                expiresIn: this._expireRefresh,
            })
    }

    createAccessToken(payload: IAccessPayload) {
        console.log('ssd:', payload)
        return jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: this._expireAccess,
            })
    }

    verifyAccessToken(token:string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (error, decoded) => {
                if (error) throw new InvalidAccessToken()
                resolve(decoded)
            })
        })
    }

    verifyRefreshToken(token:string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (error, decoded) => {
                if (error) throw new InvalidRefreshToken()
                resolve(decoded)
            })
        })
    }
}

export const jwtService = new JwtService()