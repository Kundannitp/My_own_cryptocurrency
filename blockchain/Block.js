const chain_utils=require('../chain-util');
const { DIFICULTY,MINE_RATE }=require('../config');

class Block{
    constructor(timestamp,lasthash,hash,data,nonce,dificulty){
        this.timestamp=timestamp;
        this.hash=hash;
        this.lasthash=lasthash;
        this.data=data;
        this.nonce=nonce;
        this.dificulty=dificulty || DIFICULTY;
    }

    toString(){
        return ` Block -
        TimeStamp: ${this.timestamp}
        Last Hash: ${this.lasthash.substring(0,10)}
        Hash: ${this.hash.substring(0,10)}
        Nonce: ${this.nonce}
        Data: ${this.data}
        Difficulty: ${this.dificulty};
        `
    }

    static genesis(){
        return new this('Genesis-time','------','fir-140-fhash',[],0,DIFICULTY);
    }

    static mineBlock(lastBlock,data){
        let nonce=0,hash,timestamp;
        let { dificulty }=lastBlock;
        const lasthash=lastBlock.hash;
        do{
            timestamp = Date.now();
            nonce++;
            dificulty=Block.adjustDificulty(lastBlock,timestamp);
            hash = Block.hash(timestamp, lastBlock.hash, data, nonce,dificulty);
        }while(hash.substring(0,dificulty)!=='0'.repeat(dificulty));
        

        return new this(timestamp,lasthash,hash,data,nonce,dificulty);
    }

    static adjustDificulty(lastBlock,currentTime){
        let {dificulty} = lastBlock;
        dificulty=lastBlock.timestamp + MINE_RATE > currentTime ? dificulty+1:dificulty-1;
        return dificulty;
    }

    static hash(timestamp,lasthash,data,nonce,dificulty){
        return chain_utils.hash(`${timestamp}${lasthash}${data}${nonce}${dificulty}`).toString();
    }

    static blockHash(block){
        return chain_utils.hash(`${block.timestamp}${block.lasthash}${block.data}${block.nonce}${block.dificulty}`).toString();
    }
}

module.exports = Block;