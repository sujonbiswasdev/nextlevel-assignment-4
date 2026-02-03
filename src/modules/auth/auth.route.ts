import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { Roles } from "../../middleware/auth.const";

const router=Router()
router.get('/me',auth([Roles.Admin,Roles.Customer,Roles.Provider]),authController.getCurentUser)

export const authRouter={router}