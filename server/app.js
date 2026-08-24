import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import { router } from './router/router.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/games', router)


app.listen(process.env.PORT, ()=>{
    console.log(`server runing http://localhost:${process.env.PORT}`);
    
})
