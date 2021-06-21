const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('http://localhost:8546')
const web3 = new Web3(provider);

const content = fs.readFileSync('contracts/Blackjack.sol', 'utf-8');


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

    const myName = await contractInstance.methods.getMyName().call();
  })
  .on('error', (err) => { 
  })
}

deployAndRunContract();

