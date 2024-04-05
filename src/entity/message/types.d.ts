
export type IMailResponse = {
    countPage: number,
    messages: IMailResponseObject[]
}

export type IMailResponseObject = {
    "@odata.etag": string,
    "id": string,
    "createdDateTime": string,
    "lastModifiedDateTime": string,
    "changeKey": string,
    "categories": [],
    "receivedDateTime": string,
    "sentDateTime": string,
    "hasAttachments": false,
    "internetMessageId": string,
    "subject": string,
    "bodyPreview": string,
    "importance": string,
    "parentFolderId": string,
    "conversationId": string,
    "conversationIndex": string,
    "isDeliveryReceiptRequested": string | null,
    "isReadReceiptRequested": boolean,
    "isRead": boolean,
    "isDraft": boolean,
    "webLink": string,
    "inferenceClassification": string,
    "body": IMailResponseBody,
    "sender": ISenderMailObject,
    "from": ISenderMailObject,
    "toRecipients": ISenderMailObject[],
    "ccRecipients": any[],
    "bccRecipients": any[],
    "replyTo": any[],
    "flag": {
        "flagStatus": string
    }

}

export type IMailResponseBody = {
    "contentType": string,
    "content": string
}

export type ISenderMailObject = {
    "emailAddress": {
        "name": string,
        "address": string
    }
}


export type ISendMailRequest = {
    "recipient_mail":string,
    "subject"?: string,
    "body": string
}