import express from 'express'
import cors from 'cors'
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import { authRouter } from './modules/auth/auth.route';
import { mealRouter } from './modules/meal/meal.route';
import errorHandler from './middleware/globalErrorHandeller';
import {  Notfound } from './middleware/notFound';
import { providerRouter } from './modules/provider/provider.route';
import { OrderRouter } from './modules/order/order.route';
import { CategoryRouter } from './modules/category/category.route';
import { UserRouter } from './modules/user/user.route';


const app = express()
// middleware
app.use(express.json());

// cors
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
// meal
app.use("/api",mealRouter.router)

// provider
app.use("/api",providerRouter.router)
// order
app.use("/api",OrderRouter.router)

// category
app.use("/api",CategoryRouter.router)


// users
app.use("/api",UserRouter.router)

app.use("/api/auth",authRouter.router)


app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(errorHandler)
app.use(Notfound)

export default app