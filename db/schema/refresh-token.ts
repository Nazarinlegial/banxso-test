import {BaseCollection} from "./base";
import {ObjectId} from "bson";

export interface RefreshTokenCollection extends BaseCollection {
    token: string,
    secret_id: ObjectId,
    key_id: ObjectId
}

