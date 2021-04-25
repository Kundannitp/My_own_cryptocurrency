const Transaction=require('./transaction');

class TransactionPool{

    constructor(){
        this.transactions=[];
    }

    updateOrAddTransactions(transaction){
        let transactionId=this.transactions.find(t=>t.id===transaction.id);

        if(transactionId){
            this.transactions[this.transactions.indexOf(transactionId)]=transaction;
        }else{
            this.transactions.push(transaction);
        }
    }

    existTransaction(publicKey){
        return this.transactions.find(t=>t.input.address===publicKey);
    }

    validTransactions(){
        var outputTotal=0;
        const arr=new Array();
        this.transactions.forEach(tr=>{
            outputTotal=0;
            tr.output.forEach(ot=>{
                outputTotal+=ot.amount;
            });
            // console.log(outputTotal);
            if(tr.input.amount===outputTotal&&Transaction.validateTransaction(tr)){
                arr.push(tr);
            }
        });

        return arr;
    }

    clear(){
        this.transactions=[];
    }
}

module.exports=TransactionPool;