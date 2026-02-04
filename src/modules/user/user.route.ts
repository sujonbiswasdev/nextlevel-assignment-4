import { Router } from "express";
import { Roles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const router=Router()

router.get("/admin/users",auth([Roles.Admin]),UserController.GetAllUsers)


export const UserRouter={router}