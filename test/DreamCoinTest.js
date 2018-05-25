const MusicCoin = artifacts.require('./MusicCoin.sol');

let owner;
let feeAccount;

let coin;
let rate = 100;

let oneHundredTokens = web3.toWei(100, "ether");
let fiftyTokens = web3.toWei(50, "ether");

let oneEther = web3.toWei(1, "ether");

contract('DreamCoinTest', (accounts) => {

    beforeEach(async () => {
        owner = accounts[0];
        feeAccount = accounts[1];

        coin = await MusicCoin.new(feeAccount, rate);
    });

    it("buy coins works correctly", async () => {
        await coin.buy({from: owner, value: oneEther});

        let balance = await coin.balanceOf(owner);
        assert(balance.toNumber() == web3.toWei(rate, "ether"));
    });
  
})