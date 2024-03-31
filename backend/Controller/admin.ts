import {msalClient} from "@/server/Services/msal.service";
import {MS_REDIRECT_PATH} from "@/config/msal.config";
import {AuthorizationCodeRequest, AuthorizationUrlRequest} from "@azure/msal-node";
import {NextRequest} from "next/server";
import {createURI} from "@/server/Hellpers/Utils";

class AdminController {
    constructor(private msClient = msalClient) {}
    private _SCOPES:string[] = ['User.read','Mail.read','Mail.send']

    public async login(req: NextRequest) {
        const urlParams = {
            scopes: this._SCOPES,
            redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
        } satisfies AuthorizationUrlRequest

        console.log('Create URI', createURI(MS_REDIRECT_PATH!, req.url))
        try {
            const authUrl = await this.msClient.getAuthCodeUrl(urlParams)
            return Response.redirect(authUrl)
        } catch (error) {
            console.error("Error login api: ", error)
        }
    }


    public async redirect(req: NextRequest) {
        const url = new URL(req.url)
        const code = url.searchParams.get("code")

        const tokenRequest = {
            code: code!,
            scopes: this._SCOPES,
            redirectUri: createURI(MS_REDIRECT_PATH!, req.url)
        } satisfies AuthorizationCodeRequest;

        try {
            const response = await this.msClient.acquireTokenByCode(tokenRequest)
            console.dir(response, {depth: 4})
        } catch (error) {
            console.error("Error redirect api: ", error)

        }



        return Response.redirect( createURI('/', req.url))
    }
}


export default new AdminController()