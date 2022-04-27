import './App.css';
import * as web3 from '@solana/web3.js';
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils';


function App() {

  let foundProgramIds = [""]
  foundProgramIds.pop();

  const uniqueMessages = [
    "Instruction: Create"
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

  let counter = 0;
  const connection = new web3.Connection(
    web3.clusterApiUrl('mainnet-beta'),
    'confirmed',
  );

  const getLatestBlock = async() => {
    const blockHeight = await connection.getBlockHeight();
    return blockHeight;
  } 

  const analyzeStreamflow = async() => {
    const programId = "8e72pYCDaxu3GqMfeQ5r8wFgoZSYk6oua1Qo9XpsZjX"
    await analyzeProgramId(programId, "2ufBALxQgVE3zjQDQZVnfYmjRgZ2jC4deNm36kUCx5jU5df4SKFcm5pD2eAVFfL3kxUTuXQcWixX7XDE64Ak38cw")
  }


  const analyzeProgramId = async(programId: string, previousId?: string) => {
    //const programInfo = await connection.getAccountInfo(new web3.PublicKey(programId))
    const transactions = await connection.getConfirmedSignaturesForAddress2(new web3.PublicKey(programId), { before: previousId })



    transactions.forEach( async(transaction) => {
      const transactionId = transaction.signature;

      // Here we need to analyze every individual transaction
      await analyzeTransaction(transactionId)
      console.log(counter)
      console.log()
      

    })
    

    
    if (transactions.length === 1000) await analyzeProgramId(programId, transactions.at(999)?.signature)
  }
  
  const analyzeTransaction = async( transaction: any ) => {

    const transactionInfo = typeof transaction === "string" ? await connection.getTransaction(transaction) : transaction

    if (transactionInfo && transactionInfo.meta && transactionInfo.meta.logMessages) {

      const logMessages: string[] = transactionInfo.meta.logMessages

      
      logMessages.forEach((logMessage) => {
        uniqueMessages.forEach(uniqueMessage => {
        if (logMessage?.includes(uniqueMessage)) {
            //foundProgramIds.push(mainProgramId)
            console.log(logMessage + "     + " + transaction)
            console.log()
            
        }
      })
      console.log(counter)
      })
      
    }
  }



  const analyzeSignature = () => {

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
