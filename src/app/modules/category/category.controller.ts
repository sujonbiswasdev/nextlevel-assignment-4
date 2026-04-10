import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { status } from "http-status";

const CreateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ success: false, message: "you are unauthorized" });
    }
    const result = await categoryService.CreateCategory(
      req.body,
      user.id as string,
    );
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: 'your category has been created',
      data: result,
    });
  },
);

const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getCategory();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "retrieve category successfully",
    data: result,
  });
});

const SingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.SingleCategory(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "retrieve single category successfully",
    data: result,
  });
});

const UpdateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.UpdateCategory(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "your category has beed changed",
    data: result,
  });
});

const DeleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.DeleteCategory(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "your category has beed deleted",
    data: result,
  });
});

export const CategoryController = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory,
};
