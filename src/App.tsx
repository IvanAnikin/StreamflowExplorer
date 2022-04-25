import './App.css';
import * as web3 from '@solana/web3.js';


function App() {

  var interesting_ids = {
    "BONFIDA": "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
    "BONFIDA Pool Program": "WvmTNLpGMVbwJVYztYL4Hnsy82cJhQorxjnnXcRm3b6" ,
    "BONFIDA Maps Pool": "Gnhy3boBT4MA8TTjGip5ND2uNsceh1Wgeaw1rYJo51ZY",
    "BONFIDA Oxy Pool": "9iDWyYZ5VHBCxxmWZogoY3Z6FSbKsX4WFe37c728krdT",
    "BONFIDA Ray Pool": "4fiysjiegD8yoqHX75YXBvhBzmaUEQhyuAVRX8fGL3F1",
    "BONFIDA Governance Token": "5vUBtmmHjSfpY1h24XhzEjRKjDyK5jNL9gT2BfM3wcnb"
  };

  //const onload = async () => {
  //  var element = document.getElementById('btn') as HTMLButtonElement;
  //  var element2 = document.getElementById('btn2') as HTMLButtonElement;
  //  element.classList.add('btn btn-primary');
  //  element2.classList.add('btn btn-primary');
  //}

  const get_interesting = async () => {

    for (let [key, value] of Object.entries(interesting_ids)) {
      var connection = new web3.Connection(
        web3.clusterApiUrl('mainnet-beta'),
        'confirmed',
      );
      console.log("Searching for '" + key + "' with id = '" + value + "'")
      connection = new web3.Connection(
        web3.clusterApiUrl('mainnet-beta'),
        'confirmed',
      );
      var value_var = value as string;
      let account = await connection.getAccountInfo(new web3.PublicKey(value_var));
      console.log("Account info:");
      console.log(account);
      let programAccounts = await connection.getProgramAccounts(new web3.PublicKey(value_var));
      console.log("Program accounts:");
      console.log(programAccounts);
    }
    console.log("Finished 'get_interesting' function")

  }

  const search = async () => {

    var search_field = document.getElementById("search_field") as HTMLInputElement;
    var search_field_val = search_field.value as string;
    for (let [key, value] of Object.entries(interesting_ids)) {
      if(search_field_val == key){
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
    console.log(account);

    console.log("Finished 'search' function")
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Explore Solana network - F12 Console</h1>
        <input type="text" id="search_field" name="search_field" placeholder='Account name or ID'></input>
        <button  type="button" onClick={search} id="btn" className='btn btn-light'>Search</button>
        <button  type="button" onClick={get_interesting} id="btn2" className='btn btn-light'>Get saved interesting accounts</button>
      </header>
    </div>
  );
}

export default App;
