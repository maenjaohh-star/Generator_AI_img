import prisma from "./config/prisma";

async function main() {
    const assets = await prisma.asset.findMany({
        include: {
            user: true
        }
    });

    console.log(JSON.stringify(assets, null, 2));
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });