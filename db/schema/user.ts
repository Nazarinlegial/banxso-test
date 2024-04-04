import {IBaseCollection} from "./";
import {IProfileGraphResponse} from "@/backend/Common/Interface";

export interface UserCollection extends IBaseCollection {
    profile: IProfileGraphResponse
    role: string,
}