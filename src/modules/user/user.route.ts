import { Router } from "express";
import { UserRoles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const router=Router()

router.get("/admin/users",auth([UserRoles.Admin]),UserController.GetAllUsers)
router.patch("/admin/users/:id",auth([UserRoles.Admin]),UserController.UpdateUserStatus)
router.get("/users/profile/:id",auth([UserRoles.Customer,UserRoles.Admin,UserRoles.Provider]),UserController.getUserprofile)

router.put("/customer/profile/:id",auth([UserRoles.Customer]),UserController.UpateCustomerProfile)
router.put("/admin/profile/:id/role",auth([UserRoles.Admin]),UserController.ChangeUserRole)
router.delete("/users/profile/:id",auth([UserRoles.Admin]),UserController.DeleteUserProfile)
router.delete("/users/profile/own",auth([UserRoles.Provider,UserRoles.Customer,UserRoles.Admin]),UserController.OwnProfileDelete)
export const UserRouter={router}