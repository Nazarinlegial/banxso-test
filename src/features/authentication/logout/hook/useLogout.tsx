'use client'
import {client, removeHeaderToken} from "@/shared/api/client";
import {useAppContext} from "@/_app/providers/context";
import {useRouter} from "next/navigation";
import {IUserPayload} from "@/entity/user/types";


export const useLogout = () => {
    const {updateState} = useAppContext()
    const {push} = useRouter()

    return () => {
        try {
            client.get('/auth/logout')
                .then(res => {
                    removeHeaderToken()
                    updateState({
                        isAuth: false,
                        user: {} as IUserPayload
                    })
                    push('/dashboard')
                })
        } catch (e) {
            console.log(e)
        }
    }
}