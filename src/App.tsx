import './App.css';
import * as web3 from '@solana/web3.js';
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils';


function App() {

  let foundProgramIds = [""]
  foundProgramIds.pop();

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

    //Streamflow original transactions examples
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //Create: 5qcpvrv1HdqUg6ZULScgwN2CkeGN9fywgQmgAqkqqcUCgqg2RRa6nQcrtm43rScQUAHgytbzs6QWhdaEeGms2d56
    //Withdraw: 3qm3dUx4puGDC4YnLPKdxqvZa5U2RmbbGBbWCGConRBCgCRUcCWW4ATtejf9ksp9guk87uPQ3ncdZNVJqqCGUnHK
    //Transfer: 3G6YW6hrHakHEdbEBb2pBoCWo56WoZKmeyZPnnwCfEdQaDovy27B63KRTWT99nWQURHPdWykomKDe86AFHmAZYaU
    //Cancel: 4cLjhm9wkzRm6A6Cp4sX8Gd6dYBpALtQ5vayZDNyQpKwkarJnajDKo7eFto3rcrzfJJameWsZVZMPbeeBr9pbWLh
    //////////////////////////////////////////////////////////////////////////////////////////////////

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

  const connection = new web3.Connection(
    web3.clusterApiUrl('mainnet-beta'),
    'confirmed',
  );

  let counter = 0;
    let badAccsCount = 0;

  const getLatestBlock = async() => {
    const blockHeight = await connection.getBlockHeight();
    return blockHeight;
  } 

  const analyzeStreamflow = async() => {
    const programId = "8e72pYCDaxu3GqMfeQ5r8wFgoZSYk6oua1Qo9XpsZjX"
    await analyzeProgramId(programId)
  }

  



  const analyzeProgramId = async(programId: string, previousId?: string) => {
    //const programInfo = await connection.getAccountInfo(new web3.PublicKey(programId))
    const transactions = await connection.getConfirmedSignaturesForAddress2(new web3.PublicKey(programId), { before: previousId })

    const state = await analyzeState("8e72pYCDaxu3GqMfeQ5r8wFgoZSYk6oua1Qo9XpsZjX")
    console.log(state)
    /*for (let i = 0; i < transactions.length; i++){
      await analyzeTransaction(transactions.at(i)?.signature)
      await new Promise((r) => setTimeout(r, 200)) // wait 5 seconds
    }*/

    //const transactionId = "3QuLmNK9VLqufnTuwVcAQ3BhYiakT7d1kNEJepz8mR57v6xfsrRvbhu158YRB1EstzhuWbhvQBcFhD8m9ny6bhVu";
	//await analyzeTransaction(transactionId)
    counter++
    //console.log(counter)
    //if (transactions.length === 1000) await analyzeProgramId(programId, transactions.at(999)?.signature)
  }
  


  const analyzeTransaction = async( transaction: any ) => {

    const transactionInfo = typeof transaction === "string" ? await connection.getParsedTransaction(transaction) : transaction
	//console.log(transactionInfo)
	//checking acc count
	//const pubkey = new web3.PublicKey(transactionInfo.transaction.message.accountKeys[0].pubkey._bn)
	//console.log(pubkey.toString())sdf
	//checking log message
    
    if (transactionInfo && transactionInfo.meta && transactionInfo.meta.logMessages) {

        const logMessages: string[] = transactionInfo.meta.logMessages
        analyzeLogMessages(logMessages)
	    const message: any = transactionInfo.transaction.message
        const accAnalyzation: any = analyzeAccounts(message);
        
        
        /*console.log(accAnalyzation)
        console.log(message.instructions[0].accounts.length)
        console.log(transactionInfo)*/

    }
  }

  const analyzeState = async(programId: string) => {
    const programAccounts = await connection.getProgramAccounts(new web3.PublicKey(programId));

    let isSizeSame = true
    programAccounts.forEach((program) => {
        if (program.account.data.length !== 304){
            isSizeSame = false
        }
    })
    
    return isSizeSame
  }

  const analyzeAccounts = (message: any) => {
    if(message.instructions[0].accounts.length === 8 || message.instructions[0].accounts.length === 9 || message.instructions[0].accounts.length === 10 || message.instructions[0].accounts.length === 12){

        //pair instructions with instruction attributes
        var instructionAttributes = new Array()
        message.instructions[0].accounts.forEach((instructionAccount: any) => {
            message.accountKeys.forEach((accountKey: any) => {
                const a = toString()
                if(JSON.stringify(accountKey.pubkey._bn.words) === JSON.stringify(instructionAccount._bn.words)){
                    instructionAttributes.push([accountKey.signer, accountKey.writable])
                }
            })
        })

        //check if instruction structure fits any streamflow transaction
        switch(JSON.stringify(instructionAttributes)){
            case JSON.stringify(instructionStructureCreate):
                return [true, "create"]
            case JSON.stringify(instructionStructureCreate2):
                return [true, "create"]
            case JSON.stringify(instructionStructureWithdraw):
                return [true, "withdraw"]
            case JSON.stringify(instructionStructureWithdraw2):
                return [true, "withdraw"]
            case JSON.stringify(instructionStructureTransfer):
                return [true, "transfer"]
            case JSON.stringify(instructionStructureCancel):
                return [true, "cancel"]
            case JSON.stringify(instructionStructureCancel2):
                return [true, "cancel"]
            default:
                return [false, instructionAttributes]
        }
    }
  }

  const getPubkeyFromKey = (accountKey: string) => {
    const pubkey = new web3.PublicKey(accountKey)
    return pubkey.toString()
  }

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

  const getNewestProgramIds = async () => {
    

    for (let i = 0; i < 1000 /*100*/; i++){
      const block = await connection.getBlockHeight();
      console.log("Block height: " + block);
      try {
        const blockInfo = await connection.getBlock(block);
        console.log(blockInfo)

        if (blockInfo) for (let transationIndex = 0; transationIndex < blockInfo?.transactions.length; transationIndex++){
          const transaction = blockInfo?.transactions.at(transationIndex)
          let foundAccounts = [""]
          
          analyzeTransaction(transaction)

         
        }


        
      }
      catch (error){
        console.log("ERROR")
      }
      
      console.log(foundProgramIds.length);


      

      //await new Promise((r) => setTimeout(r, 5000)) // wait 5 seconds

    }
  }


  const printSavedProgramIds = () => {
    for (let i = 0; i < foundProgramIds.length; i++){
      console.log(foundProgramIds.at(i))
    }
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
        <div className='form-group' id="input_form">
          <input type="text" className="form-control" id="search_field" name="search_field" placeholder='Account name or ID'></input>
          <button type="button" onClick={search} id="btn" className='btn btn-light'>Search</button>
          <button type="button" onClick={get_interesting} id="btn2" className='btn btn-light'>Get saved interesting accounts</button>¨
          <br></br>
          <h1>Other usefull methods:</h1>
          <button type='button' onClick={getNewestProgramIds}>Get newest program ids</button>
          <button type='button' onClick={printSavedProgramIds}>Print saved program ids</button>
          <button type='button' onClick={analyzeStreamflow}>Analyze Streamflow program</button>

        </div>
      </header>
    </div>
  );
}

export default App;