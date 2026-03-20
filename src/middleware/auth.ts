import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import status from "http-status";
import AppError from "../errorHelper/AppError";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";

const auth = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No session token provided.",
        );
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            console.log("Session Expiring Soon!!");
          }

          if (user.status === "suspend") {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access! User is not active.",
            );
          }
          if (roles.length > 0 && !roles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource.",
            );
          }

          req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
            emailVerified:user.emailVerified,
            isActive:user.isActive,
            name:user.name,
            status:user.status
          };
        }

        const accessToken = CookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access! No access token provided.",
          );
        }
      }
       const accessToken = CookieUtils.getCookie(req, 'accessToken');
         if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

          const verifiedToken = jwtUtils.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string);
        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
        }

         if (roles.length > 0 && !roles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

      next();
    } catch (error:any) {
      throw new AppError(status.BAD_REQUEST, error.message);
    }
  };
};
export default auth;
