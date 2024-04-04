import {ObjectId} from 'mongodb'
export function decodeObjectId (id:string) {
    return new ObjectId(Buffer.from(id, "base64"))
}