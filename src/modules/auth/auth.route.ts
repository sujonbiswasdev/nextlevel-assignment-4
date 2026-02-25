import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";

const router=Router()
router.get('/me',auth([UserRoles.Admin,UserRoles.Customer,UserRoles.Provider]),authController.getCurrentUser)

router.post('/logout',auth([UserRoles.Admin,UserRoles.Customer,UserRoles.Provider]),authController.signoutUser)

router.post('/register',authController.signup)
router.post('/login',authController.signin)


export const authRouter={router}