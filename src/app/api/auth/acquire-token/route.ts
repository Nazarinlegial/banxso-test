import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    console.log(req.nextUrl)
    return NextResponse.json({lol: 'lol'},{
        status: 200
    })
}