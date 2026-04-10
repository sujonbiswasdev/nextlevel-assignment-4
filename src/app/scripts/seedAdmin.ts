import "dotenv/config";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

export const seedAdmin = async () => {

  await prisma.$connect();
  console.log("DB Connected");
  await auth.api.signUpEmail({
    body: {
      name: "admin12",
      email: "admin1234@gmail.com",
      password: "admin1234",
      emailVerified:true,
      image: "https://images.pexels.com/users/avatars/2159489466/sujon-biswas-288.jpg?auto=compress&fit=crop&h=140&w=140&dpr=1",
      phone: "01804935939",
      bgimage: "https://res.cloudinary.com/drmeagmkl/image/upload/v1765536346/sujonbiswas_exfo5o.jpg",
      role:"Admin",
    },
  });
};

seedAdmin();
