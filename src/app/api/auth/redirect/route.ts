import {NextRequest, NextResponse} from "next/server";
import {authController} from "@/backend/Controller";
import {createURI} from "@/backend/Hellpers/Utils";

export async function GET(req: NextRequest, res:NextResponse) {
    const response = await authController.redirect(req)

    if(response && 'account' in response) {

    }

    return Response.redirect(createURI('/', req.url))

}