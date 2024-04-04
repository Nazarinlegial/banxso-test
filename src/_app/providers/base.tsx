import React, {FC} from "react";
import {cn} from "@/shared/utils";
import {Inter as FontSans} from "next/font/google"
import {AppProvider, IAppContext} from "@/_app/providers/context";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

type BaseProviderProps = {
    children: React.ReactNode
    state: IAppContext
}

export const BaseProvider: FC<BaseProviderProps> = function ({children, state}) {

    return (
        <AppProvider state={state}>


            <main className={cn(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable
            )}>
                {children}
            </main>
        </AppProvider>
    )
}