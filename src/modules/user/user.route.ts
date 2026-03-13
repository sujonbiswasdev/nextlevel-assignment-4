import { validateRequest } from './../../middleware/validateRequest';
import { Router } from "express";
import { UserRoles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";
import { UpdataroleData, UpdateuserProfileData } from './user.validation';

const router=Router()

router.get("/admin/users",auth([UserRoles.Admin]),UserController.GetAllUsers)
router.put("/user/profile/update",auth([UserRoles.Customer,UserRoles.Provider,UserRoles.Admin]),validateRequest(UpdateuserProfileData),UserController.UpateUserProfile)
router.get("/user/profile/:id",auth([UserRoles.Customer,UserRoles.Admin,UserRoles.Provider]),UserController.getUserprofile)
router.put("/admin/profile/:id",auth([UserRoles.Admin]),validateRequest(UpdataroleData),UserController.UpdateUser)
router.delete("/user/profile/own",auth([UserRoles.Provider,UserRoles.Customer,UserRoles.Admin]),UserController.OwnProfileDelete)
router.delete("/user/profile/:id",auth([UserRoles.Admin]),UserController.DeleteUserProfile)
export const UserRouter={router}
