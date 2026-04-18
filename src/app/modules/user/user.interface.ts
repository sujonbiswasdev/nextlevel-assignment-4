import z from "zod";
import { UpdateuserProfileData } from "./user.validation";

export interface UserQueryOptions{
  data?: {
    email?: string;
    emailVerified?: boolean;
    role?: string;
    status?: string;
    phone?: string;
    name?:string;
    isActive?:boolean;
  };
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// updata user profile
export type IUpdateuserProfileData=z.infer<typeof UpdateuserProfileData>