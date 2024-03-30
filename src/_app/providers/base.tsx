import React, {FC} from "react";
import {cn} from "@/shared/utils";
import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

type BaseProviderProps = {
    children: React.ReactNode
}

export const BaseProvider:FC<BaseProviderProps> = function ({children}) {

    return (
        <main className={cn(
            "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
        )}>
            {children}
        </main>
    )
}