import crypto from "node:crypto"

class Cipher {
    private __algorithm: crypto.CipherGCMTypes = "aes-256-gcm"

    public generatedKey(size: number = 32) {
        return crypto.randomBytes(size).toString('base64')
    }

    public encrypt(text: string, key: string) {
        const iv = crypto.randomBytes(12).toString('base64')

        const cipher = crypto.createCipheriv(
            this.__algorithm,
            Buffer.from(key, 'base64'),
            Buffer.from(iv, 'base64')
        )
        let cipherText = cipher.update(text, 'utf8', 'base64')

        cipherText += cipher.final('base64')

        const tag = cipher.getAuthTag().toString('base64')

        return {iv, tag, cipherText}
    }

    public decrypt(cipherText: string, key: string, iv: string, tag: string ) {
        const decipher = crypto.createDecipheriv(
            this.__algorithm,
            Buffer.from(key, 'base64'),
            Buffer.from(iv, 'base64')
        )

        decipher.setAuthTag(Buffer.from(tag, 'base64'))

        let text = decipher.update(cipherText, 'base64', 'utf8')

        text += decipher.final('utf8')

        return text
    }
}

export const cipherInstance = new Cipher()