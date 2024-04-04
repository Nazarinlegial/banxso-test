import React, {FC} from "react";
import Link from "next/link";

type LoginProps = {
    params: any
}

export default function Login () {

    return (
        <section className={`dashboard`}>
            Login<br/>
            <Link href={'/api/auth/login'}>signIn</Link>
        </section>
    )
}