import {ObjectId} from "bson";

export interface BaseCollection {
    _id: ObjectId
    created_at?: Date
    update_at?: Date
}