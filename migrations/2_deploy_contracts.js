var MusicCoin = artifacts.require("MusicCoin");
var MusicSeconds = artifacts.require("MusicSeconds");

module.exports = function(deployer, network, accounts) {
	deployer.deploy(MusicCoin, accounts[1], "10")
    		.then(function(){
        		return MusicCoin.deployed();
    		})
    		.then(function(coinInstance){
        		deployer.deploy(MusicSeconds, "Music Seconds", "MUS", 227, coinInstance.address)
                		.then(function(){
                        		return MusicSeconds.deployed();
                		})
    		})
};
