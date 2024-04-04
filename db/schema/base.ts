import {Document} from "mongodb";

export interface IBaseCollection extends Document{
    created_at?: Date | string
    update_at?: Date | string
}