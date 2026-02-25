import { auth } from "../lib/auth"
import { prisma } from "../lib/prisma"

const seedAdmin = async () => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: process.env.email
            }
        })
        if (existingUser) {
            throw new Error("User Already existing")
        }
        const data = await auth.api.signUpEmail({
            body: {
                name: "admin user",
                email: process.env.email as string,
                password: process.env.password as string,
                role: "Admin",
                bgimage:""


            },
        });
        if(data){
            console.log('admin user created sucessfully')
            return {message:"Admin user created successfully"};
            
        }
        console.log('Admin user created fail')
        return "Admin user created fail";
    } catch (error: any) {
        console.log(error.message)
    }

}
seedAdmin()