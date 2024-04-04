import {NextRequest, NextResponse} from "next/server";
import {authController} from "@/backend/Controller";


export async function GET(req: NextRequest, res: NextResponse) {
    return await authController.login(req)
}