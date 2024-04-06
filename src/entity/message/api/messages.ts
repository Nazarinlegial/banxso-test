import {keepPreviousData, useMutation, useQuery} from "@tanstack/react-query";
import {client} from "@/shared/api/client";
import {IMailResponse, ISendMailRequest} from "@/entity/message/types";

export const messageKey = ['message', 'mail']

export const useMessages = (query: Record<string, number>) => useQuery({
    queryKey: [...messageKey, {...query}],
    queryFn: async () => {
        try {
            const res = await client.get<IMailResponse>('/mail/messages', {
                params: query
            })
            return res.data
        } catch (e) {
            throw e
        }
    },
    placeholderData: keepPreviousData
})

export const useMutationSendMessage = () => {
    return useMutation({
        mutationKey: [...messageKey, 'send'],
        mutationFn: async (body: ISendMailRequest) => {
            const res = await client.post('/mail/send', body)
            return res.data
        }
    })
}