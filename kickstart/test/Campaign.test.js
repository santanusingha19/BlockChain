const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100')
        .send({ from: accounts[0], gas: '1000000'
    });
        
    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];
    //OR
    //[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});
describe('Campaigns', () => {
    it ('Deploy a factory and a Campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it ('Caller as the campaign manager to mark', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    it ('Allows people to contribute money and marks them as approvers', async() => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });
    it('Requires a minimum contributions', async() => {
        try {
            await campaign.methods.contribute().send({
                value: '10',
                from: accounts[1]
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });
    it ('Create a request by manager', async() => {
        await campaign.methods
        .createRequest('Buy a batteries', '500', accounts[1])
        .send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy a batteries',request.description);
    });
    it ('Process request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            gas: '1000000',
            value: web3.utils.toWei('10','ether')
        });
        console.log('Contribute 1 called');

        await campaign.methods.contribute().send({
            from: accounts[1],
            gas: '1000000',
            value: web3.utils.toWei('9','ether')
        });
        console.log('Contribute 2 called');

        await campaign.methods.contribute().send({
            from: accounts[2],
            gas: '1000000',
            value: web3.utils.toWei('6','ether')
        });
        console.log('Contribute 3 called');

        await campaign.methods.createRequest('Buy a Computer', web3.utils.toWei('20','ether'), accounts[3]).send({
            from: accounts[0],
            gas: '1000000'
        });
        console.log('Create requested');
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        console.log('Approved 1');

        await campaign.methods.approveRequest(0).send({
            from: accounts[2],
            gas: '1000000'
        });
        console.log('Approve 2');

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[3]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 100);
    });
});
