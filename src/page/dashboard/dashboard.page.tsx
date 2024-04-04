import React, {FC} from "react";
import Link from "next/link";
import {createURI} from "@/backend/Hellpers/Utils";
import {IMailResponse} from "@/backend/Common/Interface";
import {$fetch} from "@/backend/Hellpers/Utils/url";

type DashboardProps = {
    params: any
}

export default async function Dashboard ({params}:DashboardProps) {
    // const mail  = await $fetch('/api/mail/messages')

    return (
        <section className={`dashboard`}>
            Dashboard<br/>
            <Link href={'/login'}>Login</Link>
        </section>
    )
}