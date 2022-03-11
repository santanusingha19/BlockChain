// compile code will go here
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const { assert } = require('console');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
//const inboxPath = path.resolve(__dirname, 'Lottery', 'Lottery.sol');

const source = fs.readFileSync(lotteryPath, 'utf-8');

//console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[':Lottery'];
