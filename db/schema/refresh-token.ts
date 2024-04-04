import {IBaseCollection} from "./base";
import {ObjectId} from "bson";

export interface RefreshTokenCollection extends IBaseCollection {
    token: string,
    // secret_id: ObjectId,
    // refresh_key_id: ObjectId
    user_id: ObjectId
}

