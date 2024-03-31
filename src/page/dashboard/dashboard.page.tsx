import React, {FC} from "react";
import {db} from "@/db/index";
import Link from "next/link";



type DashboardProps = {
    params: any
}

export default async function Dashboard ({params}:DashboardProps) {
    // const client = await clientPromise
    // const db = client.db("sample_mflix")
    const role = await db.collection("role").find().toArray()

    return (
        <section className={`dashboard`}>
            Dashboard<br/>
            <Link href={'/login'}>Login</Link>
        </section>
    )
}