const express=require("express");
const bodyParser=require("body-parser");
const Blockchain=require("../blockchain");
const P2pserver=require('./p2p-server');
const Wallet=require('../walet');
const TransactionPool=require('../walet/transactionPool');
const Miner=require('./miner');


const HTTP_PORT=process.env.HTTP_PORT||3001;
const app=express();

app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

const bc=new Blockchain;
const wallet=new Wallet();
const tp=new TransactionPool();
const p2pserver = new P2pserver(bc,tp);
const miner=new Miner(bc,p2pserver,wallet,tp);

app.get('/blocks',(req,res)=>{
    res.json(bc.chain);
});

app.post('/blocks',(req,res)=>{
    const blocks=bc.addBlock(req.body.data);
    console.log(`a new block get added: ${blocks.toString()}`);

    p2pserver.syncChains();

    res.redirect('/blocks');
});

app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
});

app.post('/transactions',(req,res)=>{
    const {amount,reciepnt}=req.body;
    const transaction=wallet.createTransaction(reciepnt,amount,tp);
    p2pserver.broadCastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/mykey',(req,res)=>{
    res.json({publicKey:wallet.publicKey});
});

app.get('/mine-transaction',(req,res)=>{
    const block=miner.mine();
    console.log(`new block is added: ${block.toString()}`);

    res.redirect('/blocks');
    
}); 


app.listen(HTTP_PORT,()=>{
    console.log(`app running on port ${HTTP_PORT}`);
});

p2pserver.listen();
