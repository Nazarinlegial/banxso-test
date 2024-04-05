export type IUser = IUserPayload

export type IProfile = {
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

export type IUserPayload = {
    user_id: string
    role: string,
    profile: IProfile
}