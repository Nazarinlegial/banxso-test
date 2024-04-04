import * as graph from '@microsoft/microsoft-graph-client'
import {AccountInfo, ConfidentialClientApplication} from "@azure/msal-node"
import {MS_SCOPES} from "@/backend/Services/msal.service";
import {accountQuery} from "@/db/query/account";
import {cryptoService} from "@/backend/Services/encrypt.service";
import 'isomorphic-fetch'

// class ApiGraphService {
//     private api: AxiosInstance;
//
//     constructor(accessToken: string, req) {
//         this.api = axios.create({
//             baseURL: 'https://graph.microsoft.com/v1.0/me',
//         })
//
//         this.api.interceptors.response.use((response) => {
//             return response
//         }, async (err: AxiosError) => {
//             const originalRequest: any = err.config
//             if (err.response!.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true
//
//             }
//         })
//     }
//
//     private addBearerToken(token: string) {
//         this.api.defaults.headers.common["Authorization"] = "Bearer " + token
//     }
//
//
//     getProfile(accessToken: string) {
//         this.addBearerToken(accessToken)
//         try {
//             const response = this.api.get('/')
//         } catch (e) {
//             console.error('Error ')
//
//         }
//     }
//
// }


export function getAuthenticatedGraphClient(options: {
    msalClient: ConfidentialClientApplication,
    userId: string,
    redirectUri: string
}) {
    if (!options.msalClient || !options.userId) {
        throw new Error(
            `Invalid MSAL state. Client: ${options.msalClient ? 'present' : 'missing'}, User ID: ${options.userId ? 'present' : 'missing'}`);
    }

    // Initialize Graph client
    return graph.Client.init({
        // Implement an auth provider that gets a token
        // from the app's MSAL instance
        authProvider: async (done) => {
            try {
                let account: AccountInfo | null;

                // Шукаємо аккаунт в кеші
                account = await options.msalClient
                    .getTokenCache()
                    .getAccountByHomeId(options.userId)

                if (!account) {
                    // Якщо немає в кеші то шукаємо аккаунт клієнта в базі данних

                    const accountData = await accountQuery.getAccount(
                        {accountId: options.userId},
                        {selectMSAccount: true}
                    )

                    if (accountData) {
                        const {ms_account} = accountData
                        // Та дешифруємо его об'єкт аккаунта із тексту

                        account = cryptoService.decryptStringToObject<AccountInfo>(
                            accountData.ms_account.cipher_text,
                            {
                                key: ms_account.key,
                                iv: ms_account.iv!,
                                tag: ms_account.tag!

                            }
                        )
                    }


                }


                if (account) {
                    // Attempt to get the token silently
                    // This method uses the token cache and
                    // refreshes expired tokens as needed
                    const response = await options.msalClient.acquireTokenSilent({
                        scopes: MS_SCOPES,
                        redirectUri: options.redirectUri,
                        account: account
                    });

                    await accountQuery.updateAccountCredentials(
                        response.accessToken,
                        response.account!
                    )

                    // First param to callback is the error,
                    // Set to null in success case
                    done(null, response.accessToken);
                }
            } catch (err) {
                console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
                done(err, null);
            }
        }
    });
}