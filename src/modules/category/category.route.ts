import { Router } from "express";
import { Roles } from "../../middleware/auth.const";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";

const router=Router()

router.post("/admin/category",auth([Roles.Admin]),CategoryController.CreateCategory)

export const CategoryRouter={router}