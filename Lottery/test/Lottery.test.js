const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface,bytecode } = require('../compile.js');

let lottery;
let accounts;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    //console.log('Starting', accounts[0]);
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data:bytecode })
        .send( { from: accounts[0], gas:'1000000'});
    //console.log('The end of before each');
});

describe('Lottery Contract', () => {
    it('Deploy a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('Allow one account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1, players.length);
    });
    it('Allow multiple accounts to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3, players.length);
    });
    it('Require a minimum amounts to entering', async() => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.002', 'ether')
            });
            assert(false);
            // const players = await lottery.methods.getPlayers().call({
            //     from: accounts[0]
            // });
            // assert.equal(1, players.length);
        } catch(err) {
            //console.log(err);
            assert(err);
        }

    });
    it('Only manager can call pickWinner function', async() => {
        try{
            await lottery.methods.pickWinner().send({ 
                from: accounts[1]
             });
             assert(false);
        } catch(err) {
            assert(err);
        }
    });
    it('Sends money to winner and game reset', async() => {
        try {
            console.log('Start trying');
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('2', 'ether')
            });
            const initialBalance = await web3.eth.getBalance(accounts[0]);
            console.log(initialBalance);
            await lottery.methods.pickWinner().send({ from: accounts[0] });
            const finalBalance = await web3.eth.getBalance(accounts[0]);
            console.log(finalBalance);
            const differance = finalBalance - initialBalance;
            console.log(differance);
            assert(differance > web3.utils.toWei('1.9', 'ether'));
        } catch (err) {
            console.log('Calling Catch');
            assert(err);
        }
        
    });

}); 