const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const compiled_contract = require('../compile');
const bytecode = compiled_contract.evm.bytecode.object;
const abi = compiled_contract.abi;
let accounts;
let inbox;


beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(abi)
         .deploy({ data: bytecode, arguments: ['Hi there!'] })
         .send({ from: accounts[0], gas: '1000000' });
    
    inbox.setProvider(provider);
    //console.log(inbox_compiled);
    // console.log('Abi: ')
    // console.log(abi);
    // console.log('Bytecode: ')
    // console.log(bytecode);
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)
    });

    it('has an initial message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual('Hi there!', message)
    });

    it('setting a new message', async () => {
        const newMessage = "Bye there!";
        await inbox.methods.setMessage(newMessage).send( { from: accounts[1] } );
        const message = await inbox.methods.message().call();
        assert.strictEqual(newMessage, message)
    })
})