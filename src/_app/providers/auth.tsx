'use client'

import React, {useEffect} from "react";
import {useAppContext} from "@/_app/providers/context";
import {updateRefreshToken} from "@/shared/api/client";
import {jwtDecode} from "jwt-decode";
import {IUserPayload} from "@/entity/user/types";
import {useRouter, usePathname} from "next/navigation";
import {setHeaderToken} from "@/shared/api/client";

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const {updateState, isAuth} = useAppContext()
    const {push} = useRouter()
    const pathname = usePathname()

    useEffect( () => {
        updateRefreshToken()
            .then(tokens => {
                if(!tokens) return

                setHeaderToken(tokens.accessToken)
                const payload = jwtDecode<IUserPayload>(tokens.accessToken)
                updateState({
                    isAuth: true,
                    user: {
                        ...payload
                    },
                })
                push('/dashboard')
            })
            .catch(error => {
                push('/login')
            })
    }, []);


    useEffect(() => {
        if(pathname !== '/login' && !isAuth) push('/login')
        if(isAuth && pathname === '/login') push('/dashboard')

    }, [isAuth]);

    return children
}