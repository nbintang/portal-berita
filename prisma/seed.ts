import { PrismaClient } from "@prisma/client";


const db = new PrismaClient()

async function main() {
    
    
    console.log();
};


main().then(async () => {
    await db.$disconnect();
    process.exit(0);
}).catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
})