import Web3 from "web3";
import solc from "solc";
import fs from "fs";

// const web33 = new Web3('HTTP://127.0.0.1:7545');
const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

/*

//Get balance in wei 
console.log(web3.eth.getBalance("0xa394D30512d0eA801F3055cd627d0148A4Ae9015").then(console.log));

//Get balance in ethers
console.log(web3.eth.getBalance("0xa394D30512d0eA801F3055cd627d0148A4Ae9015").then((result) => {
    console.log(result);
    console.log(web3.utils.fromWei(result, "ether"))
}));

//Transfer ether from one acc to another
let result = web3.eth.sendTransaction({
    from: "0xa394D30512d0eA801F3055cd627d0148A4Ae9015",
    to: "0x06eFF5fF7cA62461Ba3521e214F79c132766A072",
    value: web3.utils.toWei(2, "ether")
})
console.log("qwdq",result);

//smart contract + ganache integration
const contract = new web3.eth.Contract([
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_x",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "x",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
], "0xED2126052c575cfAc95B60DBf0D9F6011769fbe0");


contract.methods.x().call().then(res => console.log(res))
contract.methods.set(300).send({from:"0xE02D028E6f617Db1ac36Df7650c1C4a41a2346b0"})
*/

//Generation of ABI and Byte Code
let file = "demo.sol";
const fileContent = fs.readFileSync(file).toString();
const input = {
  language: 'Solidity',
  sources: {
    file: {
      content: fileContent
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

let output = JSON.parse(solc.compile(JSON.stringify(input)));
let ABI = output.contracts["file"]["Demo"].abi;
let bytecode = output.contracts["file"]["Demo"].evm.bytecode.object;

console.log(file);
console.log(fileContent);
console.log("output",output);
console.log("abi",ABI);
console.log("bytecode",bytecode)


//Depoying smart contract
const contract = new web3.eth.Contract(ABI);
web3.eth.getAccounts()
  .then((accounts) => {
    let defaultAccount = accounts[0];
    contract.deploy({data:bytecode})
    .send({from:defaultAccount,gas:90000})
    .then(()=>{console.log("success")})
    .catch((error) => {
      if (error.message.includes('invalid opcode')) {
        console.error('Invalid opcode error:', error);
      } else if (error.message.includes('out of gas')) {
        console.error('Out of gas error:', error);
      } else {
        console.error('General error:', error);
      }
    });
  })
  .catch(err => console.log("errrr",err))
