// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
//const { interface, bytecode } = require('./compile.js');

const compiledFactory = require('./build/CampaignFactory.json');
//const compiledCampaign = require('./ethereum/build/Campaign.json');


const provider = new HDWalletProvider('slight food reopen rose violin hill vote sleep pulp struggle habit armor',
'https://rinkeby.infura.io/v3/aabb5559b6e14671a4aed6205e5b8004'
);

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    console.log('Trying to deploy from', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse( compiledFactory.interface ))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from:accounts[0] });
    //console.log(compiledFactory.interface);
    console.log('Contract deploy to: ', result.options.address);
    provider.engine.stop();
};
deploy();