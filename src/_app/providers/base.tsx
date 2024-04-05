'use client'

import React, {FC} from "react";
import {cn} from "@/shared/utils";
import {Inter as FontSans} from "next/font/google"
import {AppProvider, IAppContext, useAppContext} from "@/_app/providers/context";
import Providers from "@/_app/providers/hydration-query";
import {AuthProvider} from "@/_app/providers/auth";
import {Toaster} from "@/shared/ui/components/ui/toaster";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

type BaseProviderProps = {
    children: React.ReactNode
}

export const BaseProvider: FC<BaseProviderProps> = function ({children}) {
    return (
        <Providers>
            <AppProvider>
                <AuthProvider>
                    <main className={cn(
                        "min-h-screen bg-background font-sans antialiased",
                        fontSans.variable
                    )}>
                        {children}
                    </main>
                </AuthProvider>
            </AppProvider>
            <Toaster />
        </Providers>
    )
}