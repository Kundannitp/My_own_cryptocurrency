const { INITIAL_BALANCE}=require('../config');
const chainutil=require('../chain-util');
const Transaction=require('./transaction');

class Wallet{
    constructor(){
        this.balance=INITIAL_BALANCE;
        this.keypairs=chainutil.getkeyspair();
        this.publicKey=this.keypairs.getPublic().encode('hex');
    }

    toString(){
        return `Wallet-
        Balance:${this.balance}
        PublicKey:${this.publicKey.toString()};
        `
    }

    getSign(hashCode){
        return this.keypairs.sign(hashCode);
    }

    createTransaction(reciepnt,amount,transactionpool){
        if(amount>this.balance){
            console.log('sorry you dont have sufficient balance');
            return;
        }
        let transaction=transactionpool.existTransaction(this.publicKey);

        if(transaction){
            transaction=transaction.updateTransaction(this,reciepnt,amount);
        }else{
            transaction=Transaction.newTransaction(this,reciepnt,amount);
        }
        
        transactionpool.updateOrAddTransactions(transaction);
        return transaction;
    }

    static blockChainWallet(){
        const blockChainWallet=new this();
        blockChainWallet.publicKey="block-chain-wallet";
        return blockChainWallet;
    }
}

module.exports=Wallet;