'use client'
import {useRouter, useSearchParams, usePathname} from "next/navigation";
import {useEffect} from "react";
import {setHeaderToken} from "@/shared/api/client";
import {router} from "next/client";
import {useAppContext} from "@/_app/providers";
import {jwtDecode} from "jwt-decode";
import {IUserPayload} from "@/entity/user/types";


export const AccessTokenListener = () => {
    const {replace} = useRouter()
    const pathname = usePathname()
    const search = useSearchParams()
    const {updateState, isAuth} = useAppContext()

    useEffect(() => {
        const accessToken = search.get('accessToken')
        if (accessToken) {
            const payload = jwtDecode<IUserPayload>(accessToken)

            updateState({
                isAuth: true,
                user: {
                    ...payload
                }
            })
            setHeaderToken(accessToken)
            replace(pathname)
        }
    }, [search.toString()]);


    return null
}