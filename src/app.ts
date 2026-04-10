import express from "express"
import { auth } from './app/lib/auth';
import { toNodeHandler } from "better-auth/node";
import {  Notfound } from './app/middleware/notFound';
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./app/middleware/globalErrorHandeller";
import { IndexRouter } from "./app/routes/index.route";
const app = express()
// middleware
app.use(express.json());
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// cors
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))
app.all('/api/auth/*splat', toNodeHandler(auth));


app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api",IndexRouter);

app.use(errorHandler)
app.use(Notfound)

export default app