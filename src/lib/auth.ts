import { betterAuth, string } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";


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
    plugins:[
        bearer(),
        
    ],
    emailVerification:{
        autoSignInAfterVerification:true,
        sendOnSignUp:true,
        sendOnSignIn:true
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn:true,
        // requireEmailVerification: true
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




