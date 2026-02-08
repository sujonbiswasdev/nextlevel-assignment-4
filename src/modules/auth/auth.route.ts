import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";

const router=Router()
router.get('/me',auth([UserRoles.Admin,UserRoles.Customer,UserRoles.Provider]),authController.getCurrentUser)


export const authRouter={router}