import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { mealController } from "./meal.controller";

const router=Router()
router.get('/meals',mealController.Getallmeals)
router.get('/meals/:id',mealController.GetSignlemeals)
router.post('/provider/meals',auth([Roles.Provider]),mealController.createMeal)
router.put('/provider/meals/:id',auth([Roles.Provider]),mealController.UpdateMeals)
router.delete('/provider/meals/:id',auth([Roles.Provider]),mealController.DeleteMeals)
export const mealRouter={router}