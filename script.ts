import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  // Seed the database with users and posts
  const user1 = await prisma.account.create({
    data: {
      account_id: "test account_id",
      note: "test note"
    }
  })
  console.log(
    `Created users: ${user1.name}`,
  )

  // Retrieve all published posts
  const allTransactions = await prisma.transaction.findMany({
    
  })
  console.log(`Retrieved all published posts: ${allTransactions}`)

  // Create a new post (written by an already existing user with email alice@prisma.io)
  const newTransaction = await prisma.transaction.create({
    data: {
      from: 'test from',
      to: 'test to',
      datetime: "test datetime",
      ammount: "test ammount"
    },
  })
  console.log(`Created a new post: ${newTransaction}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
