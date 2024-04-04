import {cipherInstance} from "@/backend/Hellpers/Chiper";

type ISecretOption = {
    key: string
    iv: string,
    tag: string
}

class CryptoService {

    decryptStringToObject<T = unknown>(objectCipher: string, options: ISecretOption): T {
        const account = cipherInstance.decrypt(
            objectCipher,
            options.key,
            options.iv,
            options.tag
        )

        return JSON.parse(account)
    }

    encryptString(data:string) {
        const key = cipherInstance.generatedKey()
        const secrets = cipherInstance.encrypt(data, key)
        return {key, ...secrets}
    }

    decryptString(objectCipher: string, options: ISecretOption): string {
        return cipherInstance.decrypt(
            objectCipher,
            options.key,
            options.iv,
            options.tag
        )
    }

}


export const cryptoService = new CryptoService()