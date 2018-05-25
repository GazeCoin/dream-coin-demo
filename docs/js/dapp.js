//TODO:
//ropsten
//https://en.wikipedia.org/wiki/Shake_It_Off
//text
//ether faucet - bokky and bitfwd

DApp = {
    web3Provider: null,
    currentAccount: null,

    musicCoinsContract: null,
    musicSecondsContract: null,
    musicCoinsAbi: [{"constant": false,"inputs": [],"name": "buy","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_recipient","type": "address"},{"name": "_value","type": "uint256"},{"name": "_data","type": "bytes"}],"name": "approveAndCall","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "mint","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"}],
    musicSecondsAbi: [{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "_tokenId","type": "uint256"}],"name": "exists","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "_owner","type": "address"},{"name": "_index","type": "uint256"}],"name": "tokenOfOwnerByIndex","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "_tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"}],

    //Localhost: 
    //musicCoinsContractAddress: "0x345ca3e014aaf5dca488057592ee47305d9b3e10",
    //musicSecondsContractAddress: "0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f",

    //Ropsten:
    musicCoinsContractAddress: "0xf268f899c406dd6bf190dba89383b09b09637b72",
    musicSecondsContractAddress: "0xff7cc39e64955f66fa59771a185329c2602285cb",

    initSecond: 75,

    init: function() {
        console.log("[x] Initializing DApp.");
        this.initWeb3();
        this.initContract();
    },

    /**************************************************************************
     * Smart Contracts interaction methods.
     *************************************************************************/

    initWeb3: function() {
        // Is there is an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            DApp.web3Provider = web3.currentProvider;
            web3 = new Web3(DApp.web3Provider);
            console.log("[x] web3 object initialized.");
        } else {
            console.log("No Web3 Provider Found. Install Metamask")
        }
    },

    initContract: function(){
        DApp.musicCoinsContract = new web3.eth.Contract(DApp.musicCoinsAbi, DApp.musicCoinsContractAddress);
        DApp.musicCoinsContract.setProvider(DApp.web3Provider);
        console.log("[x] MusicCoin contract initialized.");

        DApp.musicSecondsContract = new web3.eth.Contract(DApp.musicSecondsAbi, DApp.musicSecondsContractAddress);
        DApp.musicSecondsContract.setProvider(DApp.web3Provider);
        console.log("[x] MusicSeconds contract initialized.");

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.error(error);
            } else {
                DApp.currentAccount = accounts[0];
                console.log("[x] Using account", DApp.currentAccount);
                DApp.initFaucetForm();
                DApp.initClaimForm();
                DApp.initOwnedForm();
                DApp.initRoyaltyCalculatorForm();
                DApp.getCoinsBalance();
                DApp.getOwnedSeconds();
                DApp.getEtherBalance();
            }
        });
    },

    fromWei: function(amount){
        return web3.utils.fromWei(amount, 'ether');
    },

    toWei: function(amount){
        return web3.utils.toWei(amount, 'ether');
    },

    buyMusicCoins: function(amount){
        DApp.musicCoinsContract.methods.buy().send(
            {
                from: DApp.currentAccount,
                gas: 3000000,
                value: amount
            },
            function(error, result){
                console.log("buyMusicCoins",amount,error,result);
                console.log('[x] Tokens bought and minted.');
            }
        );
    },

    claimMusicSecond: function(trackId){
        DApp.musicCoinsContract.methods.approveAndCall(
            DApp.musicSecondsContractAddress, DApp.toWei("1"), web3.utils.toHex(trackId)).send(
            {
                from: DApp.currentAccount,
                gas: 3000000
            },
            function(error, result){
                console.log("claimMusicSecond",error,result);
                console.log('[x] Seconds claimed.');
            }
        );
    },

    getCoinsBalance: function(){
        DApp.musicCoinsContract.methods.balanceOf(DApp.currentAccount).call(
            function(error, balance){
                console.log("getCoinsBalance", DApp.currentAccount, error, balance);
                $("#owned-form #ownedCoins").val(DApp.fromWei(balance));
            }
        );
    },

    getEtherBalance: function(){
        web3.eth.getBalance(DApp.currentAccount, 
            function(error, balance){
                console.log("getEtherBalance", DApp.currentAccount, error, balance);
                $("#owned-form #ownedEther").val(DApp.fromWei(balance));
            }
        );
    },

    getOwnedSeconds: function(){
        DApp.musicSecondsContract.methods.balanceOf(DApp.currentAccount).call(
            function(error, balance){
                console.log("getOwnedSeconds", error, balance);
                if(balance > 0) {
                    $('#owned-form #play-owned-button').prop('disabled', false);
                }
                for(i=0; i<balance; i++){
                    DApp.musicSecondsContract.methods.tokenOfOwnerByIndex(DApp.currentAccount, i).call(
                        function(error, result){
                            console.log("tokenOfOwnerByIndex",error,result);
                            $("#owned-form #ownedSeconds").append("<option value='" + result + "'>" + result + "</option>");
                        }
                    )
                }
                $('#royalty-form #ownedSeconds').val(balance);
            }
        );
    },

    secondClaimed: function(trackId){
        DApp.musicSecondsContract.methods.exists(trackId).call(
            function(error, exists){
                if(exists){
                    $("#claim-form #isAvailable").val("false");
                    $('#claim-form #claim-button').prop('disabled', true);
                } else {
                    $("#claim-form #isAvailable").val("true");
                    $('#claim-form #claim-button').prop('disabled', false);
                }
            });
    },

    /**************************************************************************
     * Form methods.
     *************************************************************************/
    initFaucetForm: function(){
        $("#faucet-form #ethAmount").on('input', function(value){
            $("#faucet-form #tokens").val(value.originalEvent.srcElement.value * 10);
        });

        $("#faucet-form").submit(function(event) {
            event.preventDefault();
            console.log("clicked", $("#faucet-form #ethAmount").val());
            DApp.buyMusicCoins(DApp.toWei($("#faucet-form #ethAmount").val()));
        });
    },

    initClaimForm: function(){
        $("#claim-form #chosenSecond").val(DApp.initSecond);
        DApp.secondClaimed(DApp.initSecond);

        $("#claim-form #range").on('input', function(value){
            $("#claim-form #chosenSecond").val(value.originalEvent.srcElement.value);

            $("#claim-form #isAvailable").val("Loading...");
            DApp.secondClaimed(value.originalEvent.srcElement.value);
        });

        $("#claim-form #chosenSecond").on('input', function(value){
            $("#claim-form #isAvailable").val("Loading...");
            DApp.secondClaimed(value.originalEvent.srcElement.value);
        });

        $("#claim-form").submit(function(event) {
            event.preventDefault();
        });

        $("#claim-form #play-button").click(function() {
            var trackId = $("#claim-form #chosenSecond").val();
            DApp.play(trackId);
        });

        $("#claim-form #claim-button").click(function(event) {
            var trackId = $("#claim-form #chosenSecond").val();
            DApp.claimMusicSecond(trackId);
        });
    },

    initOwnedForm: function(){
        
        //Faucet link: https://faucet.bitfwd.xyz/

        $('#owned-form #address').val(DApp.currentAccount);

        var isDisabled = $('#owned-form #ownedSeconds option').length == 0 ;
        $('#owned-form #play-owned-button').prop('disabled', isDisabled);

        $("#owned-form #play-owned-button").click(function() {
            var selected = $('#owned-form #ownedSeconds option').filter(":selected").val();
            DApp.play(selected);
        });

        $("#owned-form #get-some-button").click(function(event) {
            DApp.handleGetMusicCoinsSubmit();
        });

        $("#owned-form").submit(function(event) {
            event.preventDefault();            
        });
    },

    initRoyaltyCalculatorForm: function(){
        $('#royalty-form #totalSeconds').val(DApp.initSecond);

        $("#royalty-form #profit").val(100);

        $("#royalty-form").submit(function(event) {
            event.preventDefault(); 

            var artistRoyalty = $("#royalty-form #profit").val()*0.30;
            $("#royalty-form #artists").val(artistRoyalty);
            var youRoyalty = $("#royalty-form #profit").val()*0.70*$('#royalty-form #ownedSeconds').val()/$('#royalty-form #totalSeconds').val();
            $("#royalty-form #you").val(youRoyalty);
        });
    },

    initTopupWalletForm: function(){
        console.log("initTopupWalletForm");
        $("#topup-wallet-form").submit(function(event) {
            event.preventDefault();
            var form = $(this);
            var targetWalletAddress = form.find('#knownWalletAddresses option').filter(":selected").val();
            var amount = form.find("#amount").val();
            var currency = form.find("#currency").val();
            console.log("[r] " + targetWalletAddress + "; " + amount + "; " + currency)
            DApp.topupWallet(targetWalletAddress, amount, currency);
        });
    },

    handleGetMusicCoinsSubmit: function(walletAddress){
        $('#faucet-tab').tab('show');
    },

    play: function(trackId) {
        console.log(trackId);
        var audio = $("#player");      
        $("#mp3_src").attr("src", "mp3/" + trackId + ".mp3");
        audio[0].pause();
        audio[0].load();//suspends and restores all audio element
        audio[0].oncanplaythrough = audio[0].play();
    }
}

$(function() {
    DApp.init();
});
