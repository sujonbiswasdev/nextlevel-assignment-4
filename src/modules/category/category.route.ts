import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { CategoryController } from "./category.controller";

const router=Router()
router.post('/admin/category',auth([Roles.Admin]),CategoryController.CreateCategory)

export const CategoryRouter={router}