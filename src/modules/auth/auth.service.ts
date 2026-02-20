import { serialize } from "cookie";
import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"

const getCurrentUser = async (id: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })
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



const signup = async (data:{name:string,email:string,password:string,image:string,phone:string,role:string,restaurantName:string,address:string,description:string}) => {
    const result = await auth.api.signUpEmail({
    body: {
        name: data.name, // required
        email: data.email, // required
        password: data.password, // required
        image: data.image,
        role:data.role as "Provider" | "Customer"
    }});

    if(data.role=="Provider"){
      await prisma.providerProfile.create({
        data: { userId: result.user.id,restaurantName:data.restaurantName,address:data.address,description:data.description}
      })
    }

  await auth.api.signInEmail({
    body: {
        email: data.email,
        password: data.password,
    }});
    return {
        success:true,
        message:`user signup sucessfully`,
        data:result
    }
}
export const authService = {
    getCurrentUser,
    signoutUser,
    signup
}