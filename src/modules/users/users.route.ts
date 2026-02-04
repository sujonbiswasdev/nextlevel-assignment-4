import { Router } from "express";

import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";
import { UserController } from "./users.controller";

const router=Router()
router.get('/admin/users',auth([Roles.Admin]),UserController.getAllUser)
router.patch('/admin/users/:id',auth([Roles.Admin]),UserController.UpdateUser)
export const UsersRouter={router}