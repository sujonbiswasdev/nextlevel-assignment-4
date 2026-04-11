import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatsService } from "./stats.service";
import { IRequestUser } from "../../interface/requestUser.interface";

const getDashboardStatsData = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "you are unauthorized"
        });
    }

    const result = await StatsService.getDashboardStatsData(user as IRequestUser);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Stats data retrieved successfully!",
        data: result
    });
});

export const StatsController = {
    getDashboardStatsData
};