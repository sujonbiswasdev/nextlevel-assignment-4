import { betterAuth, string } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { Role, Status } from "../../generated/prisma/enums";

console.log(process.env.FRONTEND_URL,'s')
console.log(process.env.BETTER_AUTH_SECRET,'s')

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.FRONTEND_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.FRONTEND_URL!],
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
            },
            emailVerified:{
              type:'boolean',
              required:false,
              
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
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24, 
        strategy: "jwt",
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
            redirectURI:`${process.env.FRONTEND_URL}/api/auth/callback/google`,
            mapProfileToUser: () => {
              return {
                role: Role.Customer,
                status: Status.activate,
                emailVerified: true,
                bgimage:""
              };
            },
          },
    },
    advanced: {
        // disableCSRFCheck: true,
        useSecureCookies: false,
        cookies: {
          state: {
            attributes: {
              sameSite: "none",
              secure: true,
              httpOnly: true,
              path: "/",
            },
          },
          sessionToken: {
            attributes: {
              sameSite: "none",
              secure: true,
              httpOnly: true,
              path: "/",
            },
          },
        },
      },
    
      redirectURLs: {
        signin: `${process.env.BETTER_AUTH_URL}`,
      },
});




