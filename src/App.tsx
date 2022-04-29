
import styles from './App.module.scss'; 
import * as web3 from '@solana/web3.js';
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils';
import { AccountStructureDto } from '../DTO/AccountStructureDto'
import { ExecutableProgramDto } from '../DTO/ExecutableProgramDto'
import { ProgramDto } from '../DTO/ProgramDto';
import { ForkedProgramDto } from "../DTO/ForkedProgramDto"
import { useState } from 'react';
import React from 'react';


function App() {

  const [background, changeBackground] = useState(styles.bodyOff)
  const [tableContent, changeTable] = React.useState<Array<JSX.Element>>()

  let foundProgramIds: Array<ForkedProgramDto> = []

  //#region unique messages
  const uniqueMessages = [
    "Initializing SPL token stream",
    "Error: Given timestamps are invalid",
    "Error: Insufficient funds in ", // + acc.sender.key
    "Error: Insufficient tokens in sender's wallet",
    "Initializing recipient's associated token account",
    "Creating account for holding metadata",
    "Creating account for holding tokens",
    "Initializing escrow account for ", // + acc.mint.key token
    "Moving funds into escrow account",
    "Called by ", // + acc.sender.key
    "Metadata written in ", // + acc.metadata.key
    "Funds locked in ", // + acc.escrow_tokens.key
    "Stream duration is ", // + pretty_time(metadata.ix.end_time - metadata.ix.start_time)
    "Cliff happens at ", // + pretty_time(metadata.ix.cliff));
    "Withdrawing from SPL token stream",
    "Error: Metadata does not match given accounts",
    "Amount requested for withdraw is more than what is available",


    "Cancelling SPL token stream",

    "Transferring stream recipient",
    "Error: Insufficient funds in ", // {}",
    "Initializing new recipient's associated token account",
  ]
  const uniqueMessagesSplit = [
    ["Successfully initialized ", " token stream for "],
    [ "Returning ", " lamports ", " to "],
    ["Withdrawn: ", " tokens"],
    ["Remaining: ", " tokens"],
    ["Transferred: ", " tokens"],
    ["Returned: ", " tokens"],
    ["Returned rent: ", " lamports"]
  ]
  //#endregion

  const blacklistedProgramIds: Array<ProgramDto> = [
    { programId: "11111111111111111111111111111111" },
    { programId: "Config1111111111111111111111111111111111111" },
    { programId: "Vote111111111111111111111111111111111111111" },
    { programId: "Stake11111111111111111111111111111111111111" }
  ]

  const interesting_ids = {
    "BONFIDA": "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
    "BONFIDA Pool Program": "WvmTNLpGMVbwJVYztYL4Hnsy82cJhQorxjnnXcRm3b6" ,
    "BONFIDA Maps Pool": "Gnhy3boBT4MA8TTjGip5ND2uNsceh1Wgeaw1rYJo51ZY",
    "BONFIDA Oxy Pool": "9iDWyYZ5VHBCxxmWZogoY3Z6FSbKsX4WFe37c728krdT",
    "BONFIDA Ray Pool": "4fiysjiegD8yoqHX75YXBvhBzmaUEQhyuAVRX8fGL3F1",
    "BONFIDA Governance Token": "5vUBtmmHjSfpY1h24XhzEjRKjDyK5jNL9gT2BfM3wcnb"
  };

  const executablePrograms: Array<ExecutableProgramDto> = [] 

    //Streamflow original transactions examples
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //Create: 5qcpvrv1HdqUg6ZULScgwN2CkeGN9fywgQmgAqkqqcUCgqg2RRa6nQcrtm43rScQUAHgytbzs6QWhdaEeGms2d56
    //Withdraw: 3qm3dUx4puGDC4YnLPKdxqvZa5U2RmbbGBbWCGConRBCgCRUcCWW4ATtejf9ksp9guk87uPQ3ncdZNVJqqCGUnHK
    //Transfer: 3G6YW6hrHakHEdbEBb2pBoCWo56WoZKmeyZPnnwCfEdQaDovy27B63KRTWT99nWQURHPdWykomKDe86AFHmAZYaU
    //Cancel: 4cLjhm9wkzRm6A6Cp4sX8Gd6dYBpALtQ5vayZDNyQpKwkarJnajDKo7eFto3rcrzfJJameWsZVZMPbeeBr9pbWLh
    //////////////////////////////////////////////////////////////////////////////////////////////////

  //#region Streamflow InstructionStructure
  const instructionStructureCreate = [
    [true, true],
    [false, true],
    [false, true],
    [false, true],
    [true, true],
    [false, true],
    [false, false],
    [false, false],
    [false, false],
    [false, false],
    [false, false],
    [false, false]
 ]
 
 const instructionStructureCreate2 = [
    [true, true],
    [false, true],
    [true, true],
    [false, true],
    [true, true],
    [false, true],
    [false, false],
    [false, false],
    [false, false],
    [false, false],
    [false, false],
    [false, false]
 ]

 const instructionStructureWithdraw = [
    [true, true],
    [false, true],
    [true, true],
    [false, true],
    [false, true],
    [false, true],
    [false, false],
    [false, false]
 ]

 const instructionStructureWithdraw2 = [
    [true, true],
    [true, true],
    [true, true],
    [false, true],
    [false, true],
    [false, true],
    [false, false],
    [false, false]
 ]
 
 const instructionStructureTransfer = [
    [true, true],
    [false, true],
    [false, true],
    [false, true],
    [false, true],
    [false, false],
    [false, false],
    [false, false],
    [false, false],
    [false, false]
 ]

 const instructionStructureCancel = [
    [true, true],
    [true, true],
    [false, true],
    [false, true],
    [false, true],
    [false, true],
    [false, true],
    [false, false],
    [false, false]
 ]

 const instructionStructureCancel2 = [
    [true, true],
    [true, true],
    [false, true],
    [true, true],
    [false, true],
    [false, true],
    [false, true],
    [false, false],
    [false, false]
 ]
 //#endregion

  const connection = new web3.Connection(
    web3.clusterApiUrl('mainnet-beta'),
    'confirmed',
  );

  let counter = 0;
  let badAccsCount = 0;

  let searching = false;


  /**
   * This is just a helper method
   * Analyzes StreamFlow address
   */
  const analyzeStreamflow = async() => {
    const programId = "8e72pYCDaxu3GqMfeQ5r8wFgoZSYk6oua1Qo9XpsZjX"
    await analyzeProgramId(programId)
  }

  
  


  /**
   * searches up to 1000 program transactions and then analyzes them -> if there are more then 1000 transactions, it calles it self again in recursion until it finds them all
   * 
   * @param programId
   * @param previousId The signature to start searching from
   */
  const analyzeProgramId = async(programId: string, previousId?: string) => {
    //const programInfo = await connection.getAccountInfo(new web3.PublicKey(programId))
    const transactions = await connection.getConfirmedSignaturesForAddress2(new web3.PublicKey(programId), { before: previousId })

    //const state = await analyzeState(new web3.PublicKey("8e72pYCDaxu3GqMfeQ5r8wFgoZSYk6oua1Qo9XpsZjX"))
    //console.log(state)


    for (let i = 0; i < transactions.length; i++){
      await analyzeTransaction(transactions.at(i)?.signature)
    }

    //const transactionId = "3QuLmNK9VLqufnTuwVcAQ3BhYiakT7d1kNEJepz8mR57v6xfsrRvbhu158YRB1EstzhuWbhvQBcFhD8m9ny6bhVu";
	//await analyzeTransaction(transactionId)
    counter++
    console.log(counter)
    if (transactions.length === 1000) await analyzeProgramId(programId, transactions.at(999)?.signature)
  }
  

  /**
   * Analyzes the individual transactions and it's properties 
   * 
   * @param transaction either string address or the whole transactions with all it's data
   * @return true if possible fork
   */
  const analyzeTransaction = async( transaction: any ) => {
    const transactionInfo = typeof transaction === "string" ? await connection.getParsedTransaction(transaction) : transaction

    const logMessages: string[] = transactionInfo.meta.logMessages
    const analyzedLogMessages = analyzeLogMessages(logMessages)

	  const message: any = transactionInfo.transaction.message
    const accAnalyzation: AccountStructureDto = await analyzeAccounts(message, transactionInfo.transaction.signatures.at(0));

    if(analyzedLogMessages || accAnalyzation.possibleFork)
    {
      console.log("FORK")
      return true
    }
    else {
      console.log("NOT FORK")
      return false
    }
  }

  


  
  /**
   * Checks if program has same structure (size in bytes)
   * @Optimized
   * 
   * @param programId
   * @returns true if size is the same
   */
  const analyzeState = async(programId: web3.PublicKey) => {

    console.log("Waiting 0.5 seconds")
    await new Promise((r) => setTimeout(r, 500)) // wait 0.5 seconds
    const programAccounts = await connection.getProgramAccounts(programId);

    let isSizeSame = true
    programAccounts.forEach((program) => {
        if (program.account.data.length !== 304){
            isSizeSame = false
        }
    })

    const something = { programId: programId.toString(), isFork: isSizeSame}
    executablePrograms.push(something)

    console.log(executablePrograms)
    
    return isSizeSame
  }

  /**
   * Analyzes program's signatures 
   * - if Account count coresponds to the Original
   * - then if the props @signer and @writable have the same ordering
   *  
   * @param message
   * @returns 
   * 0. true if possible fork
   * 1. string saying which instruction it is
   */
  const analyzeAccounts = async(message: any, transactionId: string) => {
    for (let i = 0; i < message.instructions.length; i++){
      if(message.instructions[i].accounts.length === 8 || message.instructions[i].accounts.length === 9 || message.instructions[i].accounts.length === 10 || message.instructions[i].accounts.length === 12){

        await new Promise((r) => setTimeout(r, 200)) // wait 0.2 seconds
        const transactionInfo = await connection.getParsedTransaction(transactionId)
        

        const messageWithAllInfo: any = transactionInfo?.transaction.message
        //pair instructions with instruction attributes
        let instructionAttributes = new Array()

        //console.log(message.instructions[i].accounts.length + "        " + message.accountKeys.length)
        
        if (messageWithAllInfo.instructions[i].accounts) messageWithAllInfo.instructions[i].accounts.forEach((instructionAccount: any) => {
          messageWithAllInfo.accountKeys.forEach((accountKey: any) => {
            if(JSON.stringify(accountKey.pubkey._bn.words) === JSON.stringify(instructionAccount._bn.words)){
              instructionAttributes.push([accountKey.signer, accountKey.writable])
            }
          })
        })

        //check if instruction structure fits any streamflow transaction
        switch(JSON.stringify(instructionAttributes)){
              case JSON.stringify(instructionStructureCreate):
                  return { possibleFork: true, instructionType: "create" }
              case JSON.stringify(instructionStructureCreate2):
                  return { possibleFork: true, instructionType: "create"}
              case JSON.stringify(instructionStructureWithdraw):
                  return { possibleFork: true, instructionType: "withdraw"}
              case JSON.stringify(instructionStructureWithdraw2):
                  return { possibleFork: true, instructionType: "withdraw"}
              case JSON.stringify(instructionStructureTransfer):
                  return { possibleFork: true, instructionType: "transfer"}
              case JSON.stringify(instructionStructureCancel):
                  return { possibleFork: true, instructionType: "cancel"}
              case JSON.stringify(instructionStructureCancel2):
                  return { possibleFork: true, instructionType: "cancel"}
          }
      }
    }
    return { possibleFork: false, instructionType: "Something else"}
  }

  /**
   * Analyzes of at least one of the uniqueLogMessages is contained in these logMessages
   * 
   * @param logMessages Array of all logMessages of a transaction
   * @returns true if contains
   */
  const analyzeLogMessages = (logMessages: string[]) => {
    let returnState = false

    logMessages.forEach((logMessage) => {
      uniqueMessages.forEach(uniqueMessage => {
        if (!returnState && logMessage?.includes(uniqueMessage)) {
          returnState = true
        }
      })

      uniqueMessagesSplit.forEach((splitMessages: string[]) => {
        let splitState = true;
        splitMessages.forEach((uniqueMessage) => {
          if (splitState && logMessage?.includes(uniqueMessage)){
            // contains it, so lets continue
          }
          else {
            splitState = false
          }
        })
        if (splitState) returnState = true
      })
    })

    return returnState
  }

  /**
   * Tries to get as many new Blocks as possible
   * Then analyzes them based on their transactions respectively 
   * 
   * @ToBeAdded registering data to a Database
   */
  const getNewestProgramIds = async () => {
    changeBackground(styles.bodyOn)

    searching = true
    const oneTime = false // change to false if you want this to run non-stop

    while(searching){

      const block = await connection.getBlockHeight();
      console.log("Block height: " + block);

      try {
        const blockInfo = await connection.getBlock(block);

        
        

        if (blockInfo) for (const transaction of blockInfo?.transactions){
          
          console.log("analyzeTransaction")
          let isFork = await analyzeTransaction(transaction)

          console.log(isFork + " <- you are knife lol")
          let executableProgramsCounter = 0;

          /*
          if (!isFork) for (const accountKey of transaction?.transaction.message.accountKeys){
            if (!includesProgramId(executablePrograms, accountKey.toString()) && !includesProgramId(blacklistedProgramIds, accountKey.toString()) && !isFork){
              await new Promise((r) => setTimeout(r, 200)) // wait 0.2 seconds
              const accountInfo = await connection.getAccountInfo(accountKey)
              if (accountInfo?.executable) {
                console.log("analyzeState")

                isFork = await analyzeState(accountKey)
                executableProgramsCounter++
                console.log(executableProgramsCounter + " <-")
              }
            }
          }
*/
          //const programId = await findExecutableProgram(transaction.transaction.message.accountKeys)
          //if (!programId) console.log("<<<<<<<<<<<<<<<<<<<<< It does not have it >>>>>>>>>>>>>>")


          
          if (transaction && !includesProgramIds(foundProgramIds, transaction.transaction.message.accountKeys)){

            const programId = await findExecutableProgram(transaction.transaction.message.accountKeys)

            if (programId) {
              await new Promise((r) => setTimeout(r, 1000)) // wait 1 second
              const programInfo = await connection.getAccountInfo(programId)

               const newForkedProgram: ForkedProgramDto = programInfo ? 
                  { programId: programId.toString(), ownerId: programInfo?.owner.toString(), isFork: isFork } : 
                  { programId: programId.toString(), ownerId: "", isFork: isFork }

              foundProgramIds.push(newForkedProgram)
              renderTable()

              // Update UI

              // Add to the database

            }
          }
        }
        

        console.log("Block checked")
      }
      catch (error){
        console.log("ERROR: " + error)
      }

      console.log(foundProgramIds.length);

      if (oneTime) searching = false
    }
  }

  const findExecutableProgram = async(accountIds: Array<web3.PublicKey>) => {

    for (const accountKey of accountIds){
     
        await new Promise((r) => setTimeout(r, 100)) // wait 0.1 seconds
        const accountInfo = await connection.getAccountInfo(accountKey)
        if (accountInfo?.executable) {
          return accountKey
        }
      
    }
  }

  /**
   * Simple method to determine if programId is already included in programs Array
   * 
   * @param programs Array of ProgramDtos (usualy executablePrograms)
   * @param findProgramId programId you want to check if is included in programs Array
   * @returns true if programs include programId
   */
  const includesProgramIds = (programs: Array<ProgramDto>, findProgramIds: Array<web3.PublicKey>) => {

    for (const program of programs){
      for (const findProgramId of findProgramIds)
      if (program.programId === findProgramId.toString()) return true
    }
    return false
  }

  const renderTable = () => {

    console.log(foundProgramIds)

    const things: Array<JSX.Element> = []
    for(const forkedProgram of foundProgramIds){
       things.push( <div className={styles.tableRow}>		
        <div className={styles.tableData}>{forkedProgram.programId.substring(8) + ".."}</div>
        <div className={styles.tableData}>{forkedProgram.ownerId.substring(8) + ".."}</div>
        <div className={styles.tableData}>{forkedProgram.isFork}</div>
      </div>
      )
    }
    



    console.log(things)

    changeTable(things)
    
  }

  const printSavedProgramIds = () => {
    for (let i = 0; i < foundProgramIds.length; i++){
      console.log(foundProgramIds.at(i))
    }
  }

  const stopSearching = () => {
    changeBackground(styles.bodyOff)
    searching = false;
    console.log("searching stopped")
  }
  


  return (
    <div className={styles.app}>
        <header className={styles.AppHeader}>
            <h1>Streamflow Explorer</h1>
        </header>
        <body className={background}>
            <div className={styles.buttons}>
                <button className ={styles.button} role="button" onClick={getNewestProgramIds}><span className={styles.span}>Get newest program ids</span></button>
                <button className ={styles.button} role="button" onClick={stopSearching}><span className={styles.span}>Stop searching</span></button>
            </div>
            <div className="container">
	
	<div className={styles.table}>
		<div className={styles.tableHeader}>
			<div className={styles.headerItem}><a>Program Id</a></div>
			<div className={styles.headerItem}><a>Owner Id</a></div>
			<div className={styles.headerItem}><a>Is fork </a></div>
		</div>
	</div>
  {tableContent}
  

</div>
        </body>
        
    </div>
  );
}

export default App;

