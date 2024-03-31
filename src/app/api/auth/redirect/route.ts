import {NextRequest, NextResponse} from "next/server";
import {adminController} from "@/backend/Controller";

export async function GET(req: NextRequest, res:NextResponse) {
    return await adminController.redirect(req)
}