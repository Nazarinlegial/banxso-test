import {BaseCollection} from "@/db/query/base";
import {RefreshTokenCollection} from "@/db/schema/refresh-token";
import {ObjectId} from "bson";
import {WithId} from "mongodb";
import {dateFormat} from "@/backend/Hellpers/Utils/formateDate";

class RefreshTokenQuery extends BaseCollection<RefreshTokenCollection> {

    /**
     * @description Приймає на пошук два параметри. 1) Ід юзера. 2) Ід самого запису. 3) Токен який збереженно в записі
     *
     */
    async getRefreshToken(search: { id?: ObjectId, token?: string }) {

        return await this.collection.findOne({
                $or: [
                    {token: search.token},
                    {user_id: search.id},
                    {_id: search.id},
                ]
            }
        )
    }

    async addOrUpdate(obj: RefreshTokenCollection | WithId<RefreshTokenCollection>) {
        const _id = obj._id
        const updateUp = _id ? {update_at: dateFormat()} : {}

        return this.collection.updateOne({
                $or: [
                    {user_id: obj.user_id},
                    {_id: _id}
                ]
            },
            {
                $set: {
                    ...obj
                }
            },
            {
                upsert: true
            }
        )
    }


}

export const refreshTokenQuery = new RefreshTokenQuery("refresh_token")