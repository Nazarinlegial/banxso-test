import {NextRequest, NextResponse} from "next/server";
import {appController} from "@/backend/Controller/app";


export async function GET(req: NextRequest, res: NextResponse) {
        try {
                console.log('REQ', req)
                return appController.getMail(req)
        } catch (error) {
                console.log('Mails route err', error)
        }

        NextResponse.error()
}