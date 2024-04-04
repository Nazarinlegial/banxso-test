import {AuthenticationResult} from "@azure/msal-node";
import {UserCollection} from "@/db/schema/user";
import {ROLE} from "@/backend/Common/Constant";

class UserService {

    create(payload: AuthenticationResult) {
        const user = {} as UserCollection
        user.name = payload.account?.name! || 'Користувач'
        user.login = payload.account?.username
        user.role = ROLE.USER
    }



}