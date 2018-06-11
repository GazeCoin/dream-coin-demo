var utils = require('web3-utils');

const MusicCoin = artifacts.require('./MusicCoin.sol');
const MusicSeconds = artifacts.require('./MusicSeconds.sol');

let owner;
let feeAccount;
let hacker;

let coin;
let second;
let rate = 1;
let framesLimit = 100;

let oneHundredTokens = web3.toWei(100, "ether");
let fiftyTokens = web3.toWei(50, "ether");

let oneEther = web3.toWei(1, "ether");

contract('DreamCoinTest', (accounts) => {

    beforeEach(async () => {
        owner = accounts[0];
        feeAccount = accounts[1];
        hacker = accounts[2];

        coin = await MusicCoin.new(feeAccount, rate);
        second = await MusicSeconds.new("name", "symbol", framesLimit, coin.address);
    });

    function expectRevert(e, msg) {
        assert(e.message.search('revert') >= 0, msg);
    }

    it("buy coins works correctly", async () => {
        await coin.buy({from: owner, value: oneEther});

        let balance = await coin.balanceOf(owner);
        assert(balance.toNumber() == web3.toWei(rate, "ether"));
    });


    it("cannot claim seconds by calling directly receiveApproval without allowance", async () => {
        const trackId = 2;
        assert(false == await second.exists.call(trackId), "token should not be owned by anyone");
        
        try {
            await second.receiveApproval(hacker, oneHundredTokens, coin.address, utils.toHex(trackId), {from: hacker});
            assert(false);
        } catch (e) {
            expectRevert(e, "no allowance provided");
        }

        assert(false == await second.exists.call(trackId), "token still should not be owned by anyone");
    });
  
})