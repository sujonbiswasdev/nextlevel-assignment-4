import { signupValidation, updateValidation } from "./auth.validation";
import z from "zod";

export type ISignupData = z.infer<typeof signupValidation>;
export type IUpdateUserData = z.infer<typeof updateValidation>;