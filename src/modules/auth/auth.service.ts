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
        sucess:true,
        message:result?`current user retrieve successfully`:`current user retrieve failed`,
        result
    }
}
export const authService = {
    getCurrentUser,
}