import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const posts = await prisma.post.createMany({
        data: [
            {   

                title: "Testing JS app",
                content: "testing testing testing",
                authorId: null
            }, 
            {
               title: "Building a JS app",
                content: "testing testing testing",
                authorId: null
            }
        ]
    })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });