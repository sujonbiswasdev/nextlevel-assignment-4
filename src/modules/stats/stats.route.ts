import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { StatsController } from "./stats.controller";

const router=Router()
// users
router.get("/admin/users/stats",auth([UserRoles.Admin]),StatsController.getuserStats)
// provider
router.get("/admin/meals/stats",auth([UserRoles.Admin]),StatsController.getmealsStats)
// orders
router.get("/admin/orders/stats",auth([UserRoles.Admin]),StatsController.getordersStats)
// revenue
router.get("/admin/Revenue/stats",auth([UserRoles.Admin]),StatsController.getrevenueStats)
// review
router.get("/admin/reviews/stats",auth([UserRoles.Admin]),StatsController.getreviewStats)
// category
router.get("/category/stats",auth([UserRoles.Admin]),StatsController.getcategoryStats)
export const StatsRouter={router}