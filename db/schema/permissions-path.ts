import {IBaseCollection} from "./base";

export interface PermissionsPathCollection extends IBaseCollection {
    path: string,
    allowed_roles: string[]
    name?: string
}