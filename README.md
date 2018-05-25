## Inspiration

The music and film industries haven't been distrupted in a long time. Now that we have blockchain, the time has finally come. [GazeCoin](https://www.gazecoin.io/) came up with a concept of [DreamCoin](https://dreamcoin.io) and [DreamFrames](https://dreamcoin.io/dream-frames/).

## What it does

It distrupts the music industry using blockchain! By leveraging GazeCoin platform, anyone can fund anybody's music project (through crowdselling ERC20 tokens `DreamCoin`). Artists use the funds to complete their projects. Once the music piece is ready, sponsors pick seconds of the songs to own forever (by swapping their DreamCoin for ERC721 non-fungible tokens `DreamFrame Second`) and get paid royalties through smart contract. DreamFrame Second are also collectables so can be traded based on the popularity.

When a new artist comes on board, more DreamCoins are minted for his crowdsale and branded DreamFrames are created when the artwork is ready.

This demo shows how to buy a DreamCoin and how use it to claim your own piece of art. It is showcased on one song `Selling my dreams` by Dave Goode & Jeremy Hill.

There are four tabs in the UI:

* Wallet:
It displays the Ethereum wallet address and the balances of DreamCoins, DreamFrame Seconds and ether.

* Buy DreamCoins:
It allows to send ether and receive DreamCoins in return.

* Claim DreamFrame Seconds:
It allows to browse and listen to available pieces of music and it lets to claim them.

* Royalty Calculator:
It simulates possible royalty payouts based on the profit that the song makes and the ownership percentage of the song.


## How I built it

I used Truffle Framework and Zeppelin smart contract templates (ERC20 and ERC721). Front-end is built with Web3, MetaMask and Bootstrap.

## Challenges I ran into

I'm not a front-end dev, so building UIs is always a struggle for me.

Using `approveAndCall` method to claim DreamFrame Seconds with DreamCoins in just one blockchain transaction.

## Accomplishments that I'm proud of

I managed to create this project off very quickly.

## What I learned

I learned more about ERC721 non-fungible tokens.

## What's next for DreamCoin

* Market to trade DreamFrame Seconds
* More Unit Tests for Smart Contracts
* Royalty payout functionality
