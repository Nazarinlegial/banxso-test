import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import React from "react";

// Підключення шрифтів
const montserrat = Montserrat({subsets: ["latin"]});

// Підключеня глобальних стилів
import "@/shared/style/index.scss"

// Провайдери
import {BaseProvider} from "@/_app/providers"
import {cn} from "@/shared/utils";
import {IAppContext} from "@/_app/providers/context";
import {cookies} from "next/headers";
import {jwtDecode} from "jwt-decode";
import {IAccessPayload} from "@/backend/Services/jwt.service";

export const metadata: Metadata = {
    title: "Тестовий додаток",
    description: "Banxso Media - web app",
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const accessToken = cookies().get('accessToken')?.value!
    console.log('accessToken', accessToken)
    const payload = jwtDecode<IAccessPayload>(accessToken)

    return (
        <html lang="uk">
        <body className={cn(montserrat.className, "dark") }>
        <BaseProvider state={{
            user: payload
        } || {} as IAppContext}>
            {children}
        </BaseProvider>
        </body>
        </html>
    );
}
