import {Db, MongoClient} from "mongodb";
import {mongoConfig} from "@/config/index"

// if (!process.env.MONGODB_URI) {
//     throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }



let client;
let clientPromise: Promise<MongoClient>;
let db: Db

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(mongoConfig.uri, mongoConfig.clientOptions);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
    db = (await clientPromise).db(mongoConfig.dbName)
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(mongoConfig.uri, mongoConfig.clientOptions);
    clientPromise = client.connect();
    db = (await clientPromise).db(mongoConfig.dbName)
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export {clientPromise, db};