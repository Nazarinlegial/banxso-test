import {BaseCollection} from "@/db/query/base";
import {UserCollection} from "@/db/schema/user";
import {ROLE} from "@/backend/Common/Constant";
import {IProfileGraphResponse} from "@/backend/Common/Interface";
import {ObjectId} from "bson";
import {dateFormat} from "@/backend/Hellpers/Utils/formateDate";

class UserQuery extends BaseCollection<UserCollection> {

    private createUser(profile: IProfileGraphResponse) {
        return {
            profile: profile,
            role: ROLE.USER
        } satisfies UserCollection
    }

    async addUser(profile: IProfileGraphResponse) {
        const user = this.createUser(profile)
        return this.collection.insertOne({
            ...user,
            created_at: dateFormat(),
            update_at: dateFormat()
        })
    }

    async updateRole(id: ObjectId, role: string) {
        return this.collection.updateOne({
                _id: id
            },
            {
                $set: {
                    role: role
                }
            }
        )
    }

    async getUser(id: ObjectId) {
        return this.collection.findOne({
            _id: id,
        })
    }

}

export const userQuery = new UserQuery("user")