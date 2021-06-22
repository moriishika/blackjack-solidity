const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');




const content = fs.readFileSync('./contracts/Blackjack.sol', 'utf-8');


const input = {
  language: "Solidity",
  sources: {
    'Blackjack.sol': {
      content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const provider = new Web3(Web3.givenProvider || 'http://localhost:8545')
const web3 = new Web3(provider);

const { BlackJack } = output.contracts["Blackjack.sol"];
const { abi, evm } = BlackJack;

const contract = new web3.eth.Contract(abi);

const deployAndRunContract = async () => {
  const addresses = await web3.eth.getAccounts();
  const gasPrice = await web3.eth.getGasPrice();

  contract.deploy({
    data: evm.bytecode.object,
  })
    .send({
      from: addresses[0],
      gas: 1000000,
      gasPrice,
    })
    .on('confirmation', async (confNumber, receipt) => {
      const { contractAddress } = receipt

      const contractInstance = new web3.eth.Contract(abi, contractAddress)

      const pool = await contractInstance.methods.setBet(10).call();
      console.log(pool);
      console.log(await contractInstance.methods.getCurrentPool().call())
      
    })
    .on('error', (err) => {
      console.log(err)
    })
}

deployAndRunContract();

