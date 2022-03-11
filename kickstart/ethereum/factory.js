import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
     '0x9Daf3e0DaD025Afce682707A1cC924d8D8ceEE27'
);

export default instance;