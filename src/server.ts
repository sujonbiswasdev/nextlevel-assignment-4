import { prisma } from "./app/lib/prisma"
import app from "./app"
const port = process.env.PORT || 4000

const main=async()=>{
    try {
        await prisma.$connect()
        console.log("connected to database successfully")
        app.listen(port, () => {
            console.log(`Example app listening on port http://localhost:${port}`)
        })
    } catch (error: any) {
        console.error('Server startup failed:', error.message || error)
        if (error?.stack) console.error(error.stack)
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()

