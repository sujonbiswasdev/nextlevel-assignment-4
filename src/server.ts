import { prisma } from "./lib/prisma"
import app from "./app"
const port = 5000

const main=async()=>{
    try {
        await prisma.$connect()
        console.log("connected to databaes sucessfully")
        app.listen(port, () => {
            console.log(`Example app listening on port http://localhost:${port}`)
        })
    } catch (error) {
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()

