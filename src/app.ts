import express from 'express'
import cors from 'cors'
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
const app = express()

// cors
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));

export default app