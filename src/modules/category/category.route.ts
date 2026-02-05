import { Router } from "express";
import { Roles } from "../../middleware/auth.const";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/admin/category",auth([Roles.Admin]),CategoryController.CreateCategory)
router.get("/admin/category",auth([Roles.Admin]),CategoryController.getCategory)
router.put("/admin/category/:id",auth([Roles.Admin]),CategoryController.UpdateCategory)
router.delete("/admin/category/:id",auth([Roles.Admin]),CategoryController.DeleteCategory)

export const CategoryRouter={router}