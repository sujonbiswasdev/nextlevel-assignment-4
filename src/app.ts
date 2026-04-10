import express from "express"
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import { authRouter } from './modules/auth/auth.route';
import { mealRouter } from './modules/meal/meal.route';
import {  Notfound } from './middleware/notFound';
import { providerRouter } from './modules/provider/provider.route';
import { OrderRouter } from './modules/order/order.route';
import { CategoryRouter } from './modules/category/category.route';
import { UserRouter } from './modules/user/user.route';
import { ReviewsRouter } from './modules/reviews/reviews.route';
import { StatsRouter } from './modules/stats/stats.route';
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/globalErrorHandeller";
const app = express()
// middleware
app.use(express.json());
app.use(cookieParser())

// cors
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))
app.all('/api/auth/*splat', toNodeHandler(auth));
// meal
app.use("/api/v1",mealRouter.router)

// provider
app.use("/api/v1",providerRouter.router)
// order
app.use("/api/v1",OrderRouter.router)

// category
app.use("/api/v1",CategoryRouter.router)


// users
app.use("/api/v1",UserRouter.router)
//reviews
app.use('/api/v1',ReviewsRouter.router)

//stats
app.use('/api/v1',StatsRouter.router)
// auth
app.use("/api/v1/auth",authRouter.router)

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(errorHandler)
app.use(Notfound)

export default app