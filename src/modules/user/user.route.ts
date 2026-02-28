import { Router } from "express";
import { UserRoles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const router=Router()

router.get("/admin/users",auth([UserRoles.Admin]),UserController.GetAllUsers)
router.put("/users/profile/update",auth([UserRoles.Customer,UserRoles.Provider,UserRoles.Admin]),UserController.UpateUserProfile)
router.get("/user/profile/:id",auth([UserRoles.Customer,UserRoles.Admin,UserRoles.Provider]),UserController.getUserprofile)
router.put("/admin/profile/:id",auth([UserRoles.Admin]),UserController.UpdateUser)
router.delete("/users/profile/own",auth([UserRoles.Provider,UserRoles.Customer,UserRoles.Admin]),UserController.OwnProfileDelete)
router.delete("/users/profile/:id",auth([UserRoles.Admin]),UserController.DeleteUserProfile)
export const UserRouter={router}
