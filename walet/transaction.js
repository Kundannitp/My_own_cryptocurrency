const chain=require('../chain-util');
const { MINE_REWARD }=require('../config');

class Transaction{

    constructor(){
        this.id=chain.getId();
        this.input=null;//consists of information about the sender
        this.output=[];//how much currency is given to a wallet
    }

    updateTransaction(senderWallet,reciepnt,amount){
        const senderOutput=this.output.find(output=>output.address===senderWallet.publicKey);
        if(amount>senderOutput.amount){
            console.log(`you don't have that much ${amount} in you wallet`);
            return this;
        }

        senderOutput.amount=senderOutput.amount-amount;

        this.output.push({
            amount,address:reciepnt
        });

        Transaction.signTransaction(this,senderWallet);

        return this;
    }

    static transactionWithOutput(senderWallet,output){
        const transaction = new this();
        transaction.output.push(...output);
         Transaction.signTransaction(transaction, senderWallet);
         return transaction;
    }

    static newTransaction(senderWallet,reciepnt,amount){
        
        if(senderWallet.balance<amount){
            console.log(`sorry your wallet don't have ${amount} balance avail`);
            return;
        }
        return this.transactionWithOutput(senderWallet, [{
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount,
                address: reciepnt
            }
        ]);
    }

    static mineReward(minewallet,blockchainwallet){
        return this.transactionWithOutput(blockchainwallet,[{
            amount:MINE_REWARD,
            address:minewallet.publicKey
        }]);    
    }

    static signTransaction(transaction,senderWallet){
        transaction.input={
            timestamp:Date.now(),
            amount:senderWallet.balance,
            address:senderWallet.publicKey,
            signature:senderWallet.getSign(chain.hash(transaction.output))
        }

    }

    static validateTransaction(transaction){
        return chain.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            chain.hash(transaction.output)
        )
    }


}

module.exports=Transaction;