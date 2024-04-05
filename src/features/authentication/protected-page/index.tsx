'use client'
import React, {FC, useEffect} from "react";
import {useAppContext} from "@/_app/providers/context";
import { useRouter} from "next/navigation";


type IWithProtectedProps = {
    role: string | string[],
    children: React.ReactNode
}

export function WithProtectedPage({children, role}: IWithProtectedProps) {
    const router = useRouter()
    const {user} = useAppContext()
    useEffect(() => {
        if (!(role === user?.role || role.includes(user?.role))) {
            router.push('/dashboard')
        }
    }, []);


    return (role === user?.role || role.includes(user?.role)) && children
}