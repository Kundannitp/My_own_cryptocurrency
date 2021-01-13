const Transaction=require('./transaction');

const Wallet=require('./index');

describe('Transaction',()=>{

    let transaction,amount,senderWallet,reciepnt;

    beforeEach(()=>{
        senderWallet=new Wallet();
        reciepnt='r3c4pnt';
        amount=50;
        transaction=Transaction.newTransaction(senderWallet,reciepnt,amount);
    })

    it('deduction of `ammount` quality',()=>{
        // console.log(transaction);
        
        expect(transaction.output.find(output=>output.address===senderWallet.publicKey).amount).toEqual(senderWallet.balance-amount);
    })

    it('input amount matches the transaction ammout',()=>{
        expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it('recieved amount',()=>{
        expect(transaction.output.find(output=>output.address===reciepnt).amount).toEqual(amount);
    });

    it('validates a valid transaction',()=>{
        expect(Transaction.validateTransaction(transaction)).toBe(true);
    });

    it('invalidate an invalid transaction',()=>{
        transaction.output[0].amount=500000;
        expect(Transaction.validateTransaction(transaction)).toBe(false);
    });

    describe('transaction not possible',()=>{

        beforeEach(()=>{
            amount=500000;
            transaction=Transaction.newTransaction(senderWallet,reciepnt,amount);
        });
        it('transaction not successfull',()=>{
            expect(transaction).toEqual(undefined);
        })
    });

    describe(`update transaction testing`,()=>{
        let nextAmount,nextReciepnt;

        beforeEach(()=>{
            nextAmount=20;
            nextReciepnt="nx4t rec1nt";
            transaction=transaction.updateTransaction(senderWallet,nextReciepnt,nextAmount);
        });

        it(`transaction to be updated`,()=>{
            expect(transaction.output.find(output=>output.address===senderWallet.publicKey).amount).toEqual(senderWallet.balance-amount-nextAmount);
        });

        it('transaction next reciepnt amount deleverd',()=>{
            expect(transaction.output.find(output=>output.address===nextReciepnt).amount).toEqual(nextAmount);
        })
    })

})