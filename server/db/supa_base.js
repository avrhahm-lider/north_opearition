import { createClient } from "@supabase/supabase-js/dist/index.cjs";
import dotenv from 'dotenv/config'

export const client = createClient(process.env.SUPA_BASE_URL, process.env.SUPA_KEY)
// const {data, error} = await client.from('sessions').select()
// console.log(data);
// console.log(error);

