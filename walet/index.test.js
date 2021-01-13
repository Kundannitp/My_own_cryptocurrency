const Wallet=require('./index');
const TransactionPool=require('./transactionPool');

describe('checking wallet',()=>{
    let wallet,transaction,transactionpool;
    beforeEach(()=>{
        wallet=new Wallet();
        transactionpool=new TransactionPool();
        transaction=wallet.createTransaction("k2j123kk", 25, transactionpool)
    });

    it('checking creation of new transaction in wallet',()=>{
        expect(transactionpool.existTransaction(wallet.publicKey)).not.toBe(undefined);
    })

    it('checking non duplication of transaction',()=>{
        wallet.createTransaction("kundan2345",80,transactionpool);
        expect(transactionpool.transactions.find(t=>t.input.address===wallet.publicKey)
        .output.find(m => m.address === "kundan2345").amount).toEqual(80);
    });
});