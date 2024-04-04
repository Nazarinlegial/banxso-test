import {IBaseCollection} from "./base";

export interface EncryptionKeysCollection extends IBaseCollection{
    key: string,
    iv?: string,
    tag?: string
    expires?:  number,
}