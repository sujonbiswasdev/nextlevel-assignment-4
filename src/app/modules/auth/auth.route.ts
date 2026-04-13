import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { createUserSchema } from "./auth.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { multerUpload } from "../../config/multer.config";
const router=Router()
router.get('/me',auth([UserRoles.Admin,UserRoles.Customer,UserRoles.Provider]),authController.getCurrentUser)

router.post('/logout',auth([UserRoles.Admin,UserRoles.Customer,UserRoles.Provider]),authController.signoutUser)
router.post('/register',validateRequest(createUserSchema),authController.signup)
router.post('/login',authController.signin)
router.post("/change-password", auth([UserRoles.Admin,UserRoles.Provider,UserRoles.Customer]), authController.changePassword)
router.post("/refresh-token", authController.getNewToken)
router.post("/verify-email", authController.verifyEmail)
router.post("/send-otp", authController.sendOtp)
router.post("/forget-password", authController.forgetPassword)
router.post("/reset-password", authController.resetPassword)

export const authRouter={router}