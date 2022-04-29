import './App.css';
import * as web3 from '@solana/web3.js';
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils';
import { AccountStructureDto } from '../DTO/AccountStructureDto'
import { ExecutableProgramDto } from '../DTO/ExecutableProgramDto'
import { ProgramDto } from '../DTO/ProgramDto';


function App() {

  let foundProgramIds: Array<string> = []

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

  const blacklistedProgramIds = [
    "11111111111111111111111111111111",
    "Config1111111111111111111111111111111111111",
    "Vote111111111111111111111111111111111111111",
    "Stake11111111111111111111111111111111111111"
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
      await new Promise((r) => setTimeout(r, 200)) // wait 0.2 seconds
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
    //console.log(transactionInfo)
    

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

        const transactionInfo = await connection.getParsedTransaction(transactionId)
        console.log("waiting 1 second")
        await new Promise((r) => setTimeout(r, 1000)) // wait 1 seconds
        

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
    searching = true
    const oneTime = true 

    while(searching){

      const block = await connection.getBlockHeight();
      console.log("Block height: " + block);

      try {
        const blockInfo = await connection.getBlock(block);

        console.log("waiting 5 secs")
        await new Promise((r) => setTimeout(r, 5000)) // wait 5 seconds
        
        

        if (blockInfo) for (let transationIndex = 0; transationIndex < blockInfo?.transactions.length; transationIndex++){
          const transaction = blockInfo?.transactions.at(transationIndex)
          
          console.log("analyzeTransaction")
          await new Promise((r) => setTimeout(r, 5000)) // wait 5 seconds
          
          let isFork = await analyzeTransaction(transaction)
          let executableProgramsCounter = 0;

          if (!isFork) transaction?.transaction.message.accountKeys.forEach(async(accountKey) => {
            if (!includesProgramId(executablePrograms, accountKey.toString()) && !isFork){
              const accountInfo = await connection.getAccountInfo(accountKey)
              if (accountInfo?.executable) {
                isFork = await analyzeState(accountKey)
                executableProgramsCounter++
              }
            }
          });


          if (isFork && transaction){
            const programId = findExecutableProgram(transaction.transaction.message.accountKeys)
            


            // Add to the database

            //

            //

            //
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

    // to be completed
    
    accountIds.forEach(() => {})
  }

  /**
   * Simple method to determine if programId is already included in programs Array
   * 
   * @param programs Array of ProgramDtos (usualy executablePrograms)
   * @param findProgramId programId you want to check if is included in programs Array
   * @returns true if programs include programId
   */
  const includesProgramId = (programs: Array<ProgramDto>, findProgramId: string) => {
    programs.forEach((program) => {
      if (program.programId === findProgramId) return true
    })
    return false
  }

  const printSavedProgramIds = () => {
    for (let i = 0; i < foundProgramIds.length; i++){
      console.log(foundProgramIds.at(i))
    }
  }

  const stopSearching = () => {
    searching = false;
    console.log("searching stopped")
  }
  

  const get_interesting = async () => {
    for (let [key, value] of Object.entries(interesting_ids)) {
      console.log("Searching for '" + key + "' with id = '" + value + "'")
      
      var pub_key = value as string; 
      let account = await connection.getAccountInfo(new web3.PublicKey(pub_key));
      console.log("Account info:");
      console.log(account);
      let programAccounts = await connection.getProgramAccounts(new web3.PublicKey(pub_key));
      console.log("Program accounts:");
      console.log(programAccounts);
      //let parsedTransactions = await connection.getParsedTransactions(new web3.PublicKey(value_var));
      //let transactionCount = await connection.getTransactionCount(new web3.PublicKey(value_var));
      //let confirmedTransactions = await connection.GetConfirmedTransaction(new web3.PublicKey(value_var));
      //console.log("Confirmed transactions:");
      //console.log(confirmedTransactions);


      await new Promise((r) => setTimeout(r, 5000)) // wait 5 seconds
    }
    console.log("Finished 'get_interesting' function")
  }

  const search = async () => {

    var search_field = document.getElementById("search_field") as HTMLInputElement;
    var search_field_val = search_field.value as string;
    for (let [key, value] of Object.entries(interesting_ids)) {
      if(search_field_val === key){
        search_field_val=value;
      }
    }
    console.log("Searching for: '" + search_field_val + "'");
    
    var connection = new web3.Connection(
      web3.clusterApiUrl('mainnet-beta'),
      'confirmed',
    );
    const slot = await connection.getSlot();
    console.log("Actual slot: " + slot)
    for (let i = 0; i < 10; i++){
      const currentSlot = slot - i;
      const block = await connection.getBlock(currentSlot);
      console.log(block)
    }
    const block = await connection.getBlocks(slot-10, slot);
    console.log("Block: " + block)
    let account = await connection.getAccountInfo(new web3.PublicKey(search_field_val)); 
    console.log("Account info:");
    console.log(account);
    let programAccounts = await connection.getProgramAccounts(new web3.PublicKey(search_field_val));
    console.log("Program accounts:");
    console.log(programAccounts);
    console.log("Finished 'search' function")
  };

  return (
    <div className="App">
        <header className="App-header">
            <h1>Explore Solana network - F12 Console</h1>
        </header>
        <body>
            <div className='form-group' id="input_form">
                <button type='button' onClick={getNewestProgramIds}>Get newest program ids</button>
                <button type='button' onClick={stopSearching}>Stop searching</button>
            </div>
        </body>
    </div>
  );
}

export default App;