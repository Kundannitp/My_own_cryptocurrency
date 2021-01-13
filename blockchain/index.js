const Block=require('./Block');
const SHA256=require('crypto-js/sha256');

class BlockChain{
    constructor(){
        this.chain=[Block.genesis()];
    }

    addBlock(data){
        const newblock=Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(newblock);

        return newblock;
    }

    validChain(chain){
        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())) return false;

        for(let i=1;i<chain.length;i++){
            if(chain[i].lasthash!==chain[i-1].hash)
                return false;
            if(Block.blockHash(chain[i])!==chain[i].hash)
                return false;
        }

        return true;
    }

    replaceChain(newchain){
        if(newchain.length<=this.chain.length){
            console.log("the new chain is not longer than the previous chain");
            return;
        }else if(!this.validChain(newchain)){
            console.log("the new chain is not valid");
            return;
        }
        console.log("Older cahin is replaced by newer chain");

        this.chain=newchain;
        return;
    }

}

module.exports=BlockChain;