import {BaseCollection} from "./base";
import {ObjectId} from "bson";

export type ICipherDataObject = {
    expires?: Date | number | string,
    cipher_text: string,
    secret_id: ObjectId
}

export interface TokensCollection extends BaseCollection {
    user_id: ObjectId
    ms_access: ICipherDataObject
    ms_account: ICipherDataObject
}