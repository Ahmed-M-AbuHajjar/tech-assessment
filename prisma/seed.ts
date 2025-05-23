import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Blurr organization if it doesn't exist
  const blurrOrg = await prisma.organization.upsert({
    where: { name: 'Blurr' },
    update: {},
    create: {
      name: 'Blurr',
    },
  })

  console.log('Created Blurr organization:', blurrOrg)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 