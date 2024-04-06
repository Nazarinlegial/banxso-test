import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import React from "react";
import dayjs from "dayjs";

// Підключення шрифтів
const montserrat = Montserrat({subsets: ["latin"]});

// Підключеня глобальних стилів
import "@/shared/style/index.scss"

// Провайдери
import {BaseProvider} from "@/_app/providers"
import {cn} from "@/shared/utils";

import "dayjs/locale/uk"
dayjs.locale('uk')

export const metadata: Metadata = {
    title: "Тестовий додаток",
    description: "Banxso Media - web app",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="uk">
        <body className={cn(montserrat.className, "dark")}>
        <BaseProvider>
            {children}
        </BaseProvider>
        </body>
        </html>
    );
}
