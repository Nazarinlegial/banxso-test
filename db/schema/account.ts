import {IBaseCollection} from "./base";
import {ObjectId} from "bson";

export type ICipherDataObject = {
    expires?: Date | number | string,
    cipher_text: string,
    secret_id: ObjectId
}

export interface AccountCollection extends IBaseCollection {
    user_id: ObjectId
    user_account_id: string
    ms_access_token: ICipherDataObject
    ms_account: ICipherDataObject
}