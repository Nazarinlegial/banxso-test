import {UserCollection} from "@/db/schema/user";
import {IJWTSecret, IRefreshPayload, jwtService} from "@/backend/Services/jwt.service";
import {WithId} from "mongodb";
import {ObjectId} from "bson";
import {refreshTokenQuery} from "@/db/query/refresh-token";
import {encryptionKeyQuery} from "@/db/query";
import {EncryptionKeysCollection} from "@/db/schema/encryption-keys";
import {RefreshTokenCollection} from "@/db/schema/refresh-token";
import {cryptoService} from "@/backend/Services/encrypt.service";
import {InvalidRefreshToken, InvalidToken} from "@/backend/Services/exception.service";


class TokenService {
    private REFRESH_TOKEN_SECRET_EXPIRE_DAY = 15 // 15 днів для секретів (секрет для JWT та серет шифрування рефреш токену)


    // async verifyAccessToken(token: string) {
    //     return jwtService.verifyAccessToken(token)
    // }
    //
    // async isTokenCollection(token: string) {
    //     const tokenData = await refreshTokenQuery.getRefreshToken({token})
    //     if(!tokenData) throw new Error('Not found token from')
    //     return tokenData
    // }
    //
    // async verifyRefreshToken(token: string) {
    //     const tokenData = await this.isTokenCollection(token)
    //     const tokenSecrets = await encryptionKeyQuery.getEncryptionKey(tokenData.secret_id)
    //     const jwtSecrets = await encryptionKeyQuery.getEncryptionKey(tokenData.refresh_key_id!)
    //
    //     const decryptToken = cryptoService.decryptString(token, {
    //         key: tokenSecrets?.key!,
    //         tag: tokenSecrets?.tag!,
    //         iv: tokenSecrets?.iv!
    //     })
    //
    //     try {
    //         return await jwtService.verify(decryptToken, jwtSecrets?.key!)
    //     } catch (error) {
    //         if(error instanceof InvalidToken) {
    //             throw new InvalidRefreshToken()
    //         }
    //     }
    // }
    //
    // createAccessToken(user: WithId<UserCollection>) {
    //         return jwtService.createAccessToken({
    //         role: user.role,
    //         user_id: new ObjectId(user._id).toString(),
    //         profile: {
    //             email: user.profile.mail,
    //             name: user.profile.displayName,
    //         }
    //     })
    // }
    //
    // private isExpireJwtSecret( oldJwtSecret: WithId<EncryptionKeysCollection> | null): IJWTSecret {
    //     if (oldJwtSecret?.expires && oldJwtSecret.expires > Date.now()) {
    //         return {
    //             secret: oldJwtSecret.key,
    //             expire: oldJwtSecret.expires
    //         }
    //     }
    //     return jwtService.generateSecret(this.REFRESH_TOKEN_SECRET_EXPIRE_DAY)
    // }
    //
    // async createAndUpdateRefreshToken(userId: ObjectId) {
    //     let jwtSecret
    //
    //     // Створюємо об'єкт для запису та додаємо `user_id` в колекцію Рефреш токенів
    //     const refreshObject = {
    //         user_id: userId
    //     } as WithId<RefreshTokenCollection>;
    //
    //     const isRefreshToken = await refreshTokenQuery.getRefreshToken({id:userId})
    //     console.log('1Refresh: isRefreshToken', userId)
    //     if(isRefreshToken) {
    //         const oldJwtSecret = await encryptionKeyQuery.getEncryptionKey(isRefreshToken.refresh_key_id)
    //         jwtSecret = this.isExpireJwtSecret(oldJwtSecret)
    //
    //     } else {
    //         jwtSecret = jwtService.generateSecret(this.REFRESH_TOKEN_SECRET_EXPIRE_DAY)
    //         console.log('2jwtSecret', jwtSecret)
    //     }
    //
    //     refreshObject.token = jwtService.createRefreshToken({user_id: new ObjectId(userId).toString()}, jwtSecret.secret)
    //     const tokenSecret = cryptoService.encryptString(refreshObject.token)
    //     console.log('3Tok Chipher', tokenSecret)
    //
    //
    //     const jwtKeySecretId = await encryptionKeyQuery.addOrUpdateEncryptionKey({
    //         key: jwtSecret.secret,
    //         expires: jwtSecret.expire
    //     }, isRefreshToken?.refresh_key_id)
    //
    //
    //     const tokenSecretId = await encryptionKeyQuery.addOrUpdateEncryptionKey({
    //         ...tokenSecret
    //     }, isRefreshToken?.secret_id)
    //
    //
    //     refreshObject.refresh_key_id = jwtKeySecretId!
    //     refreshObject.secret_id = tokenSecretId!
    //     refreshObject.token = tokenSecret.cipherText
    //
    //     console.log('4refreshObject', refreshObject.token)
    //
    //     await refreshTokenQuery.addOrUpdate(refreshObject)
    //
    //     return tokenSecret.cipherText
    // }


    async saveRefreshToken(userId: ObjectId) {
        const token = jwtService.createRefreshToken({
            user_id: new ObjectId(userId).toString()
        })

        await refreshTokenQuery.addOrUpdate({
            token,
            user_id: userId
        })

        return token
    }
}


export const tokenService = new TokenService()