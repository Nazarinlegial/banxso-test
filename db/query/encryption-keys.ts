import {EncryptionKeysCollection} from "@/db/schema/encryption-keys";
import {ObjectId} from "bson";
import {BaseCollection} from "@/db/query/base";

class EncryptionKey extends BaseCollection<EncryptionKeysCollection> {
    async addOrUpdateEncryptionKey(obj: EncryptionKeysCollection, id?: ObjectId) {
        if (id) {
            const doc = await this.collection.deleteOne({_id: id})
            console.log('doc', doc, id)
        }

        const result = await this.collection.insertOne(
            {
                ...obj,
            }
        )

        return result.insertedId
    }

    async getEncryptionKey(id: ObjectId) {
        return await this.collection.findOne({
            _id: id
        })
    }

}

export const encryptionKeyQuery = new EncryptionKey("encryption_keys")