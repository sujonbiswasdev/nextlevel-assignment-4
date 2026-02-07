import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { mealController } from "./meal.controller";

const router=Router()
router.get('/meals',mealController.Getallmeals)
router.get('/meals/:id',mealController.GetSignlemeals)
router.post('/provider/meals',auth([UserRoles.Provider]),mealController.createMeal)
router.put('/provider/meals/:id',auth([UserRoles.Provider]),mealController.UpdateMeals)
router.delete('/provider/meals/:id',auth([UserRoles.Provider]),mealController.DeleteMeals)
export const mealRouter={router}