import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Debugging Slug Resolution...");

    const festivals = await prisma.festival.findMany({
        select: { id: true, name: true, slug: true }
    });

    console.log("📋 Existing Festivals in DB:");
    console.log(JSON.stringify(festivals, null, 2));

    if (festivals.length === 0) {
        console.log("❌ NO FESTIVALS FOUND! Did seeding fail?");
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
