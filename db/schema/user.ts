import {BaseCollection} from "./";
import {ObjectId} from "bson";

export interface UserCollection extends BaseCollection {
    name: string,
    login?: string,
    email?: string,
    phone?: string,
    age?: number,
    role: ObjectId,
}