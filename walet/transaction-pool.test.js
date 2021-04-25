const Transactionpool=require('./transactionPool');
const Transaction=require('./transaction');
const Wallet=require('./index');
const block_chain = require('../blockchain/index')
const { MINE_REWARD }=require('../config');

describe('cheaking work of transaction pool',()=>{
    let wallet,transaction,tp;
    beforeEach(()=>{
        tp=new Transactionpool();
        wallet=new Wallet();
        transaction=wallet.createTransaction("random234rec",20,block_chain,tp);
    })

    it('update transactions',()=>{
        expect(tp.transactions.find(t=>t.id===transaction.id)).toEqual(transaction);
    })

    it('check added or replaced',()=>{
        let newTransaction=transaction.updateTransaction(wallet,"ku23jdfnj",15);
        tp.updateOrAddTransactions(newTransaction);
        expect(tp.transactions.find(t=>t.id===transaction.id)).toEqual(newTransaction);
    });

    describe('validation of transaction',()=>{
        let validtrans;
        beforeEach(()=>{
            validtrans = [...tp.transactions];
            for (let i = 0; i < 6; i++) {
                wallet=new Wallet();
                transaction = wallet.createTransaction("newtrans123", 25, block_chain, tp);
                if (i % 2 == 0) {
                    transaction.input.amount = 999999;
                } else {
                    validtrans.push(transaction);
                }
            }
        });

        it('all ransatipns added to transation pool are not valid',()=>{
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validtrans));
        });

        it('validTransaction function returns array of valid transaction',()=>{
            expect(tp.validTransactions()).toEqual(validtrans);
        });
    });

    describe('rewardTesting',()=>{
        beforeEach(()=>{
            transaction=Transaction.mineReward(wallet,Wallet.blockChainWallet());
        });
        it('ammount rewarded successfully',()=>{
            expect(transaction.output.find(output=>output.address===wallet.publicKey).amount).toEqual(MINE_REWARD);
        });
    });

    it('clear transaction pool',()=>{
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

})