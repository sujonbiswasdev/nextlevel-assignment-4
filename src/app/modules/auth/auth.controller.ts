import { Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../shared/catchAsync";
import { tokenUtils } from "../../utils/token";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { CookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelper/AppError";

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.email);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "retrieve current user successsfully",
    data: result,
  });
});

const signoutUser = catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.signoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const signup = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body
};
  const result = await authService.signup(payload);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "user signup successfully",
    data: result,
  });
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signin(req.body);
  const { accessToken, refreshToken, token } = result;
  console.log(token,'token')
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user signin successfully",
    data: result,
  });
});
const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
        }
        const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New tokens generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    }
)

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email verified successfully",
  });
});

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.sendOtp(email);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "OTP sent to email successfully",
  });
});

export const authController = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken,verifyEmail,
  sendOtp
};
