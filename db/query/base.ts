import {db} from "@/db/mongodb";
import {Collection} from "mongodb";
import {IBaseCollection} from "@/db/schema";

export class BaseCollection<T extends IBaseCollection> {
    protected collection: Collection<T>;
    constructor(collectionName: string) {
        this.collection = db.collection<T>(collectionName)
    }
}