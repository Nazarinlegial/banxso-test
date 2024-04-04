import {AccountCollection, ICipherDataObject} from "@/db/schema/account";
import {encryptionKeyQuery} from "@/db/query/encryption-keys";
import {BaseCollection} from "@/db/query/base";
import {ObjectId} from "bson";
import {EncryptionKeysCollection} from "@/db/schema/encryption-keys";
import {WithId} from "mongodb";
import {AccountInfo} from "@azure/msal-node";
import {cipherInstance} from "@/backend/Hellpers/Chiper";
import {dateFormat} from "@/backend/Hellpers/Utils/formateDate";
import {cryptoService} from "@/backend/Services/encrypt.service";

type TAccountOptions = {
    selectMSAccessToken?: boolean // Get ms_access_token secret data
    selectMSAccount?: boolean // Get ms_account secret data
}

type TAccountReturn = AccountCollection & {
    ms_account: ICipherDataObject & EncryptionKeysCollection,
    ms_access_token: ICipherDataObject & EncryptionKeysCollection
}

class AccountQuery extends BaseCollection<AccountCollection> {

    private createSecret(data: string) {
        // Генеруємо ключ для шифрування
        return cryptoService.encryptString(data)
    }

    private async createAccountObject(data: {
                                          user_id?: ObjectId
                                          ms_access_token: string
                                          ms_account: AccountInfo,
                                          keyOption?: {
                                              accessKey: string,
                                              account: string
                                          },
                                          update?: {
                                              ms_accessSecretId?: ObjectId,
                                              ms_accountId?: ObjectId
                                          }
                                      },
    ): Promise<AccountCollection> {


        // Шифруємо Токен достуту до майкрософт граф та інформацію про аккаунт майкрософт
        // які використовуються для доступу та обновленню доступу
        const msAccessTokenSecrets = this.createSecret(data.ms_access_token)
        const msAccountSecrets = this.createSecret(JSON.stringify(data.ms_account))


        const msAccessTokenReturnId = await encryptionKeyQuery.addOrUpdateEncryptionKey(
            {
                key: msAccessTokenSecrets.key,
                iv: msAccessTokenSecrets.iv,
                tag: msAccessTokenSecrets.tag
            },
            data.update?.ms_accessSecretId // Якщо існує секрет токену для цього запису ми його перезапишемо
        )

        console.log('data.update?.ms_accountId -> ', data.user_id, data.update?.ms_accessSecretId, msAccessTokenSecrets, msAccessTokenReturnId)
        const msAccountReturnId = await encryptionKeyQuery.addOrUpdateEncryptionKey(
            {
                key: msAccountSecrets.key,
                iv: msAccountSecrets.iv,
                tag: msAccountSecrets.tag
            },
            data.update?.ms_accountId // Якщо існує секрет аккаунту для цього запису ми його перезапишемо
        )

        return {
            user_id: data?.user_id,
            user_account_id: data.ms_account.homeAccountId,
            ms_account: {
                cipher_text: msAccountSecrets.cipherText,
                secret_id: msAccountReturnId
            },
            ms_access_token: {
                cipher_text: msAccessTokenSecrets.cipherText,
                secret_id: msAccessTokenReturnId
            }
        } as AccountCollection
    }

    async addAccount(userId: ObjectId, msAccessToken: string, msAccount: AccountInfo) {
        const doc = await this.collection.findOne({
            user_id: userId
        })

        const newAccount = await this.createAccountObject({
            user_id: userId,
            ms_access_token: msAccessToken,
            ms_account: msAccount
        })
        return this.collection.insertOne({
            ...newAccount,
            created_at: dateFormat(),
            update_at: dateFormat()
        })
    }

    private async needAnUpdateAccount(accountId: string, msAccessToken: string) {
        let flag:Boolean = false

        const oldAccount = await this.getAccount({
            accountId: accountId
        }, {
            selectMSAccessToken: true
        })


        if(!oldAccount) return

        const oldToken = cipherInstance.decrypt(
            oldAccount.ms_access_token.cipher_text,
            oldAccount.ms_access_token.key,
            oldAccount?.ms_access_token.iv!,
            oldAccount?.ms_access_token.tag!
        )

        flag = oldToken !== msAccessToken

        return {
            oldAccount,
            flag
        }

    }

    async updateAccountCredentials(msAccessToken: string, msAccount: AccountInfo) {
        const userAccountId = msAccount.homeAccountId
        const needUpdateAccount = await this.needAnUpdateAccount(userAccountId, msAccessToken)

        if(needUpdateAccount?.flag) {
            const {oldAccount} = needUpdateAccount
            console.log('old', oldAccount.user_id, oldAccount?.ms_access_token.secret_id, 'user_acc_id ', userAccountId )
            const newAccount = await this.createAccountObject({
                update: {
                    ms_accountId: oldAccount?.ms_account.secret_id,
                    ms_accessSecretId: oldAccount?.ms_access_token.secret_id
                },
                ms_account: msAccount,
                ms_access_token: msAccessToken,
                user_id: oldAccount.user_id
            })

            console.log('new_acc ', newAccount)
            return await this.collection.updateOne(
                { user_account_id: userAccountId },
                {
                    $set: {
                        ...newAccount,
                        update_at: dateFormat()
                    }
                })
        }
    }

    async getAccount(search: {
        accountId?: string,
        userId?: ObjectId
    }, options?: TAccountOptions): Promise<WithId<TAccountReturn> | undefined> {
        let ms_access_secret, ms_account_secret

        const account = await this.collection.findOne({
            $or: [
                {user_account_id: search.accountId},
                {user_id: search.userId}
            ],
        })

        if (!account) {
            console.log(`Not found collection ${search}`)
            // throw new Error('Error query account collection')
            return undefined
        }

        if (options?.selectMSAccessToken) {
            ms_access_secret = await encryptionKeyQuery.getEncryptionKey(account.ms_access_token.secret_id)
            if (ms_access_secret) {
                Object.assign(account.ms_access_token, ms_access_secret)
            }

        }

        if (options?.selectMSAccount) {
            ms_account_secret = await encryptionKeyQuery.getEncryptionKey(account.ms_account.secret_id)
            if (ms_account_secret) {
                Object.assign(account.ms_account, ms_account_secret)
            }
        }

        return account as WithId<TAccountReturn>
    }
}

export const accountQuery = new AccountQuery("account")