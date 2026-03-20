import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { tokenUtils } from "../utils/token";
import { Request, Response } from "express";
import { sendResponse } from "../shared/sendResponse";

export const seedAdmin = async () => {
  try {
    console.log(process.env.EMAIL, "initial mail");

    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: process.env.EMAIL,
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const data = await auth.api.signUpEmail({
      body: {
        name: "admin user",
        email: process.env.EMAIL as string,
        password: process.env.PASSWORD as string,
        role: "Admin",
        bgimage: "",
        phone: "01804935939",
      },
    });
    console.log("Admin created");
  } catch (error: any) {
    console.log(error);
  }
};

seedAdmin()