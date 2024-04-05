import {Button} from "@/shared/ui/components/ui/button";
import {LogIn} from "lucide-react"
import Link from "next/link";
import React from "react";


export default function SigInButton() {

    return (
        <Link href={`${process.env.NEXT_PUBLIC_API_URI}/auth/sigin`}>
            <Button variant={`outline`} size={`lg`} className={`gap-4`} role={`link`}>
                <LogIn className={`w-4 h-4`}/>
                <span>
                    Увійти через майкрософт
                </span>
            </Button>
        </Link>

    )
}