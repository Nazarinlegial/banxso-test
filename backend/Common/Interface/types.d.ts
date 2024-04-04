export type IProfileGraphResponse = {
    userPrincipalName: string,
    id: string,
    displayName: string,
    surname?: string,
    givenName?: string,
    preferredLanguage: string,
    mail: string,
    mobilePhone?: string,
    jobTitle?: string,
    officeLocation: any,
    businessPhones: [],
    ageGroup?: string
}

export type IMailResponse = {
    "@odata.context": string,
    "@odata.count": number,
    "value": IMailResponseObject[]
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
