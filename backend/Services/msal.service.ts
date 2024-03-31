import {msalConfig} from "@/config/index";
import * as msal from '@azure/msal-node'


type TMSALReqOption = {
    scopes: string[],
    redirectUri: string,
    successRedirectUri: string,
    postLogoutRedirectUri: string
}

export const msalClient = new msal.ConfidentialClientApplication(msalConfig)