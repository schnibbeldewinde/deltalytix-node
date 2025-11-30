import { MongoClient, Db } from "mongodb"

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const uri = process.env.MONGODB_URI || "mongodb://mongo:27017/deltalytix?replicaSet=rs0"
const dbName = process.env.MONGODB_DB || "deltalytix"

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error("MONGODB_URI is not set in the environment")
}

const globalWithMongo = globalThis as GlobalWithMongo

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise!
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getMongoClient() {
  return clientPromise
}

export async function getDb(name: string = dbName): Promise<Db> {
  const client = await getMongoClient()
  return client.db(name)
}
