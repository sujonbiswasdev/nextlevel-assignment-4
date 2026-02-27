import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { mealController } from "./meal.controller";

const router=Router()
router.get('/meals',mealController.Getallmeals)
router.get('/provider/meals/own',auth([UserRoles.Provider]),mealController.getownmeals)
router.post('/provider/meals',auth([UserRoles.Provider]),mealController.createMeal)
router.delete('/provider/meals/:id',auth([UserRoles.Provider]),mealController.DeleteMeals)
router.put('/provider/meals/:id',auth([UserRoles.Provider]),mealController.UpdateMeals)
router.get('/meals/:id',mealController.GetSignlemeals)
router.put('/admin/meals/:id',auth([UserRoles.Admin]),mealController.updateStatus)

export const mealRouter={router}