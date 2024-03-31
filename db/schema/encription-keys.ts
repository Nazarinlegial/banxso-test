import {BaseCollection} from "./base";

export interface EncryptionKeysCollection extends BaseCollection{
    key: string,
    iv?: string,
    tag?: string
    expires?:  number,
}