import React, {FC} from "react";
import Link from "next/link";
import {Cipher} from "@/server/Hellpers/Chiper";

type LoginProps = {
    params: any
}

const encryptor = new Cipher()

export default function Login () {

    const key = Cipher.generatedKey()
    console.log('Key ', key)
    const {iv,tag, cipherText} = encryptor.encrypt('Harry Potters _@@_', key)
    const text = encryptor.decrypt(cipherText, key, iv, tag)

    console.log('Tag', tag)
    return (
        <section className={`dashboard`}>
            Login<br/>
            <Link href={'/api/auth/login'}>signIn</Link>

            <p>
                {cipherText}
            </p>
            <p>
                {text}
            </p>
        </section>
    )
}