const express = require('express');
const bodyParser = require('body-parser');

//import { PrismaClient } from '@prisma/client'
const PrismaClientLib = require("@prisma/client")

const prisma = new PrismaClientLib.PrismaClient()

async function testPrisma() {
  const user1 = await prisma.account.create({
    data: {
      account_id: "test account_id"+ Math.floor(Math.random() * 10000).toString(),
      name: "test name",
      note: "test note"
    }
  })
  console.log(
    `Created users: ${user1.account_id}`,
  )
  const allTransactions = await prisma.transaction.findMany({
    
  })
  console.log(`Retrieved all published transactions: ${allTransactions}`)
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
async function saveAccount(account_id, name="", note="") {
    // Seed the database with users and posts
    const user1 = await prisma.account.create({
        data: {
        account_id: account_id,
        name: name,
        note: note
        }
    })
    console.log(
        `Created account: ${user1.account_id}`,
    )
}
async function saveForkedProgram(programId, owner="", isFork="") {
    // Seed the database with users and posts
    const forkedProgram = await prisma.forkedProgram.create({
        data: {
            programId: programId,
            owner: owner,
            isFork: isFork
        }
    })
    console.log(
        `Saved forkedProgram: ${forkedProgram.programId}`,
    )
}
async function getPrograms(){
    const programs =  await prisma.forkedProgram.findMany({
        select: {
            programId: true,
            owner: true,
            isFork: true
      }
    })
    return programs;
}

const app = express();
const port = process.env.PORT || 5000;

//var cors = require('cors');
//app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/testPrisma', (req, res) => {
    testPrisma();
    res.send({ express: 'testPrisma function called successfully :) ' });
});

app.post('/api/saveAccount', (req, res) => {
    console.log("Saving account: ");
    console.log("accountID: " + req.body.body.accountID);
    console.log("name: " + req.body.body.name);
    console.log("note: " + req.body.body.note);

    error="";
    saveAccount(req.body.body.accountID, req.body.body.name, req.body.body.note).catch((e) => {
        error=e.message;
        console.error(e);
        res.send(
        `Whooops: ${error}`,
        );
    });
    if(error==""){
        res.send(
        `Saved account: ${req.body.body.accountID}`,
        );
    }
});
app.post('/api/saveForkedProgram', (req, res) => {
    console.log("Saving ForkedProgram: ");
    console.log("accountID: " + req.body.body.programId);
    console.log("name: " + req.body.body.owner);
    console.log("note: " + req.body.body.isFork);

    error="";
    saveForkedProgram(req.body.body.programId, req.body.body.owner, req.body.body.isFork).catch((e) => {
        error=e.message;
        console.error(e);
        res.send(
        `Whooops: ${error}`,
        );
    });
    if(error==""){
        res.send(
        `Saved forkedProgram: ${req.body.body.programId}`,
        );
    }
});
app.get('/api/getPrograms', async (req, res) => {
    error="";
    var allPrograms = await getPrograms().catch((e) => {
        error=e.message;
        console.error(e);
        res.send(
        `Whooops: ${error}`,
        );
    });
    if(error==""){
        res.send(allPrograms);
        console.log(allPrograms);
        console.log(`Found ${allPrograms.length} programs`);   
    }
});


app.listen(port, () => console.log(`Listening on port ${port}`));