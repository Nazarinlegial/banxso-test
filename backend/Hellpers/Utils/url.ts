import {cookies} from "next/headers";

export function createURI(path: string, baseUri: string) {
    const url = new URL(path, baseUri)
    return url.toString()
}

export const $fetch = function (uri: string) {
    return fetch(new URL(uri, process.env.BASE_URI),
        {
            headers: {
                Cookie: cookies().toString()
            }
        })
}