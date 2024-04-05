'use client'

import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {IAuthorizationTokenResponse} from "@/shared/api/types";

export const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI,
    withCredentials: true
})

export const setHeaderToken = (token: string) => {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
    delete client.defaults.headers.common.Authorization;
};


export const updateRefreshToken = async () => {
    try {
        return await client.get<IAuthorizationTokenResponse>(`${process.env.NEXT_PUBLIC_API_URI!}/auth/refreshToken`)
            .then(res => res.data);
    } catch (error) {
        return null;
    }
};

export const refreshToken = async (failedRequest?: any) => {
    const newToken = await updateRefreshToken();

    if (newToken) {
        if(failedRequest) {
            failedRequest.response.config.headers.Authorization = "Bearer " + newToken.accessToken;
        }
        setHeaderToken(newToken.accessToken);
        return newToken;
    } else {
        throw new Error("Не вдалося оновити токен")
    }
};


createAuthRefreshInterceptor(client,  refreshToken, {
    statusCodes: [401],
    pauseInstanceWhileRefreshing: true,
});