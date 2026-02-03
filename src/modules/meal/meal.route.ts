import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { mealController } from "./meal.controller";

const router=Router()
router.post('/',auth([Roles.Provider]),mealController.createMeal)

export const mealRouter={router}