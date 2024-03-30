import {BaseCollection} from "./base";

export interface PermissionsPathCollection extends BaseCollection {
    path: string,
    allowed_roles: string[]
    name?: string
}