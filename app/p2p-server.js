const Websocket=require('ws');

const P2P_PORT=process.env.P2P_PORT||5001;

// $HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

const peers=process.env.PEERS ? process.env.PEERS.split(','):[];
const MSSG_TYPE={
    chain:"CHAIN",
    transaction:"TRANSACTION",
    cleartrans:"CLEAR_TRANS"
}

class P2pServer{
    constructor(blockchain,transactionpool){
        this.blockchain=blockchain;
        this.transactionpool=transactionpool;
        this.sockets=[];
    }

    listen(){
        const server=new Websocket.Server({port:P2P_PORT});
        server.on('connection',socket=>this.connectSocket(socket));

        this.connecttopeers();

        console.log(`listening for peer to peer connection on port ${P2P_PORT}`);
        
    }

    connecttopeers(){
        peers.forEach(peer => {
            const socket=new Websocket(peer);
            socket.on('open',()=>this.connectSocket(socket));
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log("socket connected");
        
        this.messageHandler(socket);

        this.sendChain(socket);

    }

    messageHandler(socket){
        socket.on('message',message=>{
            const data=JSON.parse(message);
            switch(data.type){
                case MSSG_TYPE.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MSSG_TYPE.transaction:
                    this.transactionpool.updateOrAddTransactions(data.transaction);
                    break;
                case MSSG_TYPE.cleartrans:
                    this.transactionpool.clear();
                    break;
            }
        });       
    }

    sendChain(socket){ 
        socket.send(JSON.stringify({
            type:MSSG_TYPE.chain,
            chain:this.blockchain.chain
        }));
    }

    sendTransaction(socket,transaction){
        socket.send(JSON.stringify({
            type:MSSG_TYPE.transaction,
            transaction:transaction
        }))
    }

    syncChains(){
        this.sockets.forEach(socket=>this.sendChain(socket));
    }

    broadCastTransaction(transaction){
        this.sockets.forEach(socket=>this.sendTransaction(socket,transaction));
    }

    sendClearTrans(socket){
        socket.send(JSON.stringify({
            type:MSSG_TYPE.cleartrans
        }))
    }

    broadcastClear(){
        this.sockets.forEach(socket=>this.sendClearTrans(socket));
    }

}

module.exports=P2pServer;