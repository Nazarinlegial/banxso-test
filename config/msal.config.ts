import {loadEnv} from "@/server/Hellpers/Utils";
import msal from "@azure/msal-node";
loadEnv()

export const msalConfig = {
    auth: {
        clientId: process.env.MS_CLIENT_ID!, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: process.env.MS_AUTHORITY_URI, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: process.env.MS_CLIENT_SECRET // Client secret generated from the app registration in Azure portal
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel:any, message:any, containsPii:any) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
} satisfies msal.Configuration


export const MS_REDIRECT_PATH = process.env.MS_REDIRECT_PATH;
export const MS_POST_LOGOUT_REDIRECT_URI = process.env.MS_POST_LOGOUT_REDIRECT_URI;