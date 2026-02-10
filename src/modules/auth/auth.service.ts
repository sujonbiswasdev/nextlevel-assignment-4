import { serialize } from "cookie";
import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

const getCurrentUser = async (id: string) => {
    const result= await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    return {
        success:true,
        message:`current user retrieve successfully`,
        result
    }
}

const signoutUser = async (id: string,cookies:any,headers:any) => {
    const result= await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    await auth.api.signOut({
    headers: {
        cookie:headers.cookie,
      },
    });

    return {
        success:true,
        message:`current user signout successfully`,
        result
    }
}
export const authService = {
    getCurrentUser,
    signoutUser
}