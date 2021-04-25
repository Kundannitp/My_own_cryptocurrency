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

    calculateBalance(blockChain){
        let balance=this.balance;
        let transactions=[]
        blockChain.chain.forEach(block => {
            block.data.forEach(transaction=>{
                transactions.push(transaction)
            })
        });

        const walletInputs=transactions.filter(transaction => transaction.input.address==this.publicKey);

        let startTime=0;
        // console.log(walletInputs);
        if(walletInputs.length>0){
            const recentInput = walletInputs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );
            balance=recentInput.output.find(output => output.address === this.publicKey).amount;
            startTime = recentInput.input.timestamp;
        }

        // console.log(transactions);

        transactions.forEach(transaction => {
            if(transaction.input.timestamp > startTime){
                transaction.output.find(output => {
                    if(output.address === this.publicKey){
                        balance+=output.amount;
                    }
                })
            }
        });
        return balance;
    }

    createTransaction(reciepnt,amount,block_chain,transactionpool){
        this.balance = this.calculateBalance(block_chain);
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
        // blockChainWallet.publicKey="block-chain-wallet";
        return blockChainWallet;
    }
}

module.exports=Wallet;