import { prisma } from "./lib/prisma"
import app from "./app"
import { seedAdmin } from "./scripts/seedAdmin"
const port = process.env.PORT || 4000

const main=async()=>{
    try {
        await prisma.$connect()
        await seedAdmin()
        console.log("connected to databaes successfully")
        app.listen(port, () => {
            console.log(`Example app listening on port http://localhost:${port}`)
        })
    } catch (error) {
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()

