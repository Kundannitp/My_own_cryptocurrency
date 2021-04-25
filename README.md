# My_own_cryptocurrency
Built My own cryptocurrency using blockchain in node.js
## install required modules mentioned in package.json
npm install 
## run your application
npm run dev
## connect different socket through P2P network
HTTP_PORT="write a port number greater 3001 without quotes" P2P_PORT="write a port number greater than 5001 without quotes" PEERS=ws://localhost:5001 npm run dev
## some important info:
<ol>
  <li>Each wallet has 500 Kundan_coins as initial balance</li>
  <li>Miner reward is 50 Kundan_coins</li>
</ol>
<h2>short discription of its working:</h2>
This is a blockchain based cryptocurrency made up using Node.js.</br>
Currently it is running on command line and it has the ability to connect multiple pears and gives an interface for peer to peer network where each peer is an user and has a wallet using which they can create transactions and submit them to transactions pool from where miners(can be any pear connected to the network) will mine the transation pool and the miner who mines first will add the mined block to its chain and broadcast the chain and a clear pool msg to all other peers connected to the network so that the chain off all other peers get updated with the longest chain, the ultimate goal is to update all peers with longest chain.</br>
The current balance of any wallet is calculated on the basis of most recent transaction in the chain present inside its blocks.
