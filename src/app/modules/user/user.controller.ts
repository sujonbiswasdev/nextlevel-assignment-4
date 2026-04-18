import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import paginationSortingHelper from "../../helpers/paginationHelping";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
const GetAllUsers = catchAsync(async (req: Request, res: Response) => {
  const {search} = req.query;
  const { isActive } = req.query;
  const isactivequery = isActive
    ? req.query.isActive === "true"
      ? true
      : req.query.isActive === "false"
        ? false
        : undefined
    : undefined;
    const emailVerifiedquery = req.query.emailVerified
    ? req.query.emailVerified=== "true"
      ? true
      : req.query.emailVerified === "false"
        ? false
        : undefined
    : undefined;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );
  const result = await UserService.GetAllUsers(
    req.query as any,
    isactivequery as boolean,
    emailVerifiedquery as boolean,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result,
  });
});

const getUserprofile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.getUserprofile(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message:
      user.role !== "Provider"
        ? "your user profile has been retrieved successfully"
        : "your user profile has been retrieved successfully",
    data: result,
  });
});

const UpateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const payload={
    ...req.body,
    image:req.file?.path || req.body.image
  }
  const result = await UserService.UpateUserProfile(
    payload,
    user.email as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "your profile has been updated successfully",
    data: result,
  });
});

const UpdateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.UpdateUser(
      req.params.id as string,
      req.body,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: `user change successfully`,
      data: result,
    });
  },
);

const DeleteUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.DeleteUserProfile(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "user account delete successfully",
      data: result,
    });
  },
);

const OwnProfileDelete = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.OwnProfileDelete(user.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user own account delete successfully",
    data:result
  });
});

export const UserController = {
  GetAllUsers,
  UpdateUser,
  getUserprofile,
  UpateUserProfile,
  DeleteUserProfile,
  OwnProfileDelete,
};
