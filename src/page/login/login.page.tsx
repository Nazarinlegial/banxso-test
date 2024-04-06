import React, {FC} from "react";
import Link from "next/link";
import SigInButton from "@/features/authentication/sigin/ui/sigin-btn";

type LoginProps = {
    params: any
}

export default function Login() {

    return (
        <section className={`mx-auto container w-full min-h-[100vh] flex items-center justify-center `}>
            <SigInButton />
            <Link href={`/dashboard`}></Link>
        </section>
    )
}