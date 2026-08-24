import {MongoClient} from 'mongodb'
import dotenv from 'dotenv/config'
import dns, { setServers } from 'dns'
setServers(["1.1.1.1", "8.8.8.8"])

const client = new MongoClient(process.env.MONGO_URI)

try {
    await client.connect()
    console.log('mongoDB connected seccessfuly');
    
} catch (err) {
    console.log("mongo faild");
    
    process.exit()
}

export const db = client.db('nort_oper')