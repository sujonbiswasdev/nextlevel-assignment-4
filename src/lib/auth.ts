import { betterAuth, string } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: ["Customer", "Provider", "Admin"],
                required: false,
                defaultValue: "Customer"
            },
            status: {
                type: ["activate", "suspend"],
                required: false,
                defaultValue: "activate"
            },
            phone: {
                type: "string",
                required: false
            },
            isActive: {
                type: "boolean",
                required: false,
                defaultValue: true
            },
             bgimage: {
                type: "string",
                required: false,
                defaultValue: true
            }
        }
    },
    advanced: {
        cookiePrefix: "assignment-4",
         useSecureCookies: true
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn:true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
        },
    },
});




