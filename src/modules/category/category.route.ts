import { Router } from "express";
import { UserRoles } from "../../middleware/auth.const";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/admin/category",auth([UserRoles.Admin]),CategoryController.CreateCategory)
router.get("/admin/category",CategoryController.getCategory)
router.get("/admin/category/:id",CategoryController.SingleCategory)
router.put("/admin/category/:id",auth([UserRoles.Admin]),CategoryController.UpdateCategory)
router.delete("/admin/category/:id",auth([UserRoles.Admin]),CategoryController.DeleteCategory)

export const CategoryRouter={router}