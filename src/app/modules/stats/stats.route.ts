import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { StatsController } from "./stats.controller";

const router=Router()
// users
router.get("/admin/users/stats",auth([UserRoles.Admin]),StatsController.getuserStats)
// meals
router.get("/admin/meals/stats",auth([UserRoles.Admin]),StatsController.getmealsStats)
// orders
router.get("/admin/orders/stats",auth([UserRoles.Admin]),StatsController.getordersStats)
//admin revenue
router.get("/admin/revenue/stats",auth([UserRoles.Admin]),StatsController.getrevenueStats)

// review
router.get("/admin/reviews/stats",auth([UserRoles.Admin]),StatsController.getreviewStats)
// category
router.get("/admin/category/stats",auth([UserRoles.Admin]),StatsController.getcategoryStats)

//own revenue
router.get("/provider/revenue/stats",auth([UserRoles.Provider]),StatsController.getrevenueProviderStats)
// own meals
router.get("/provider/meals/stats",auth([UserRoles.Provider]),StatsController.getProvidermealsStats)
// own orders
router.get("/provider/orders/stats",auth([UserRoles.Provider]),StatsController.getProviderordersStats)
export const StatsRouter={router}