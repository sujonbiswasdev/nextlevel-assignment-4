import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { mealController } from "./meal.controller";

const router=Router()
router.post('/',auth([Roles.Provider]),mealController.createMeal)
router.put('/:id',auth([Roles.Provider]),mealController.UpdateMeals)
router.delete('/:id',auth([Roles.Provider]),mealController.DeleteMeals)

export const mealRouter={router}