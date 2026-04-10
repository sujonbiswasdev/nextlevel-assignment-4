import { NextFunction, Request, Response } from "express";
import z from "zod";
import { formatZodIssues } from "../utils/handleZodError";
export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in data field",
        });
      }
    }

    if (!parsedResult.success) {
      const zodmessage = formatZodIssues(parsedResult.error);
      return res.status(400).json({
        success: false,
        message: "your provided data is invalid",
        zodmessage,
      });
    }

    //sanitizing the data
    req.body = parsedResult.data;
    next();
  };
};
