import express from 'express'
import cors from 'cors'
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import { authRouter } from './modules/auth/auth.route';
import errorHandler from './middleware/globalErrorHandeller';
import {  Notfound } from './middleware/notFound';



const app = express()
// middleware
app.use(express.json());

// cors
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))


app.use("/api/auth",authRouter.router)


app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(errorHandler)
app.use(Notfound)

export default app