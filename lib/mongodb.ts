import dotenv from 'dotenv'
import path from 'path'

if (typeof window === 'undefined') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
}

import { MongoClient, Db } from 'mongodb'

function getMongoURI(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local')
  }
  return uri
}

const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    const uri = getMongoURI()
      if (process.env.NODE_ENV === 'development') {
      if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri, options)
        ;(global as any)._mongoClientPromise = client.connect()
      }
      clientPromise = (global as any)._mongoClientPromise
    } else {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
  }
  
  return clientPromise!
}

export default getClientPromise()

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(process.env.MONGODB_DB_NAME || 'mattress_landing')
}
