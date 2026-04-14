import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ 
  connectionString: connectionString!,
})

const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'error', 'warn'],
})

async function test() {
  try {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected! ✅");
    
    console.log("Running test query...");
    const users = await prisma.user.findMany({
      take: 1,
    });
    
    console.log("Query successful! Found", users.length, "users");
  } catch (error: any) {
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Meta:", error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

test();
