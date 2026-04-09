import { NextFunction, Request, Response } from "express";
import { auth as betterAuthInstance } from "../lib/auth";
import status from "http-status";
import AppError from "../errorHelper/AppError";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";

const auth = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (sessionToken) {
        const betterSession = await betterAuthInstance.api.getSession({ 
          headers: req.headers as HeadersInit 
        });

        if (betterSession?.session) {
          const sessionData = await prisma.session.findFirst({
            where: {
              token: betterSession.session.token,
              expiresAt: { gt: new Date() },
            },
            include: { user: true },
          });

          if (sessionData?.user) {
            const { user } = sessionData;
            handleSessionExpiryHeader(res, sessionData);

            validateUserStatus(user.status);
            validateUserRole(user.role, roles);

            req.user = { 
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              emailVerified: user.emailVerified,
              status: user.status,
              isActive: user.isActive
            };
       
            return next();
          }
        }
      }

      if (accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        );

        if (verifiedToken.success && verifiedToken.data) {
          const userData = verifiedToken.data;

          validateUserRole(userData.role, roles);

          req.user= { 
            id: userData.id,
            role: userData.role,
            email: userData.email,
            emailVerified: userData.emailVerified,
            isActive: userData.isActive,
            name: userData.name,
            status: userData.status
       
          };
          return next();
        }
      }
      throw new AppError(status.UNAUTHORIZED, "Unauthorized! Please login to continue.");

    } catch (error: any) {
      next(new AppError(error.statusCode || status.BAD_REQUEST, error.message));
    }
  };
};

const validateUserStatus = (userStatus: string) => {
  const forbiddenStatus = ["suspend", "BLOCKED", "DELETED"];
  if (forbiddenStatus.includes(userStatus)) {
    throw new AppError(status.UNAUTHORIZED, "Access denied! Your account is not active.");
  }
};

const validateUserRole = (userRole: string, allowedRoles: string[]) => {
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    throw new AppError(status.FORBIDDEN, "Forbidden! You don't have permission.");
  }
};

const handleSessionExpiryHeader = (res: Response, session: any) => {
  const now = new Date().getTime();
  const expiresAt = new Date(session.expiresAt).getTime();
  const createdAt = new Date(session.createdAt).getTime();

  const totalLife = expiresAt - createdAt;
  const remaining = expiresAt - now;
  const percentRemaining = (remaining / totalLife) * 100;

  if (percentRemaining < 20) {
    res.setHeader("X-Session-Refresh", "true");
    res.setHeader("X-Session-Expires-At", new Date(expiresAt).toISOString());
  }
};

export default auth;