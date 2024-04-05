'use client'

import {useRouter} from "next/navigation";
import {useAppContext} from "@/_app/providers";
import {useEffect} from "react";

export default function NotFound() {
    const {isAuth} = useAppContext()
    const {push} = useRouter()

    useEffect(() => {
        push('/dashboard')
    }, []);

    return <></>
}