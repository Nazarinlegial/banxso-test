import {BaseCollection} from "./base";
import {ObjectId} from "bson";

export type ITokenDataObject = {
    expires?: Date | number | string,
    token: string,
    secret_id: ObjectId
}

export interface TokensCollection extends BaseCollection {
    user_id: ObjectId
    ms_access: string
    ms_refresh: ITokenDataObject
}