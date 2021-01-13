const Wallet=require('../walet');
const Transaction=require('../walet/transaction');

class Miner{
    constructor(blockChain,p2pserver,wallet,transitionpool){
        this.blockChain=blockChain;
        this.p2pserver=p2pserver;
        this.wallet=wallet;
        this.transitionpool=transitionpool;
    }

    mine(){
        const validTransactions=this.transitionpool.validTransactions();
        console.log(validTransactions);
        
        validTransactions.push(Transaction.mineReward(this.wallet,Wallet.blockChainWallet()));
        const newBlock=this.blockChain.addBlock(validTransactions);
        this.p2pserver.syncChains();
        this.transitionpool.clear();
        this.p2pserver.broadcastClear();
        
        return newBlock;
    }
}

module.exports=Miner;