const Block=require('./Block');
// const { DIFICULTY }=require('../config');

describe('Block',()=>{
    let data,lastBlock,block;
    beforeEach(()=>{
        data='block';
        lastBlock=Block.genesis();
        block=Block.mineBlock(lastBlock,data);
    });

    it('add block to chain with nonce',()=>{
        expect(block.hash.substring(0,block.dificulty)).toEqual('0'.repeat(block.dificulty));
    });

    it('testing dynamic difficulty',()=>{
        expect(Block.adjustDificulty(block,block.timestamp+36000)).toEqual(block.dificulty-1);
    });

    it('sets the `data` to match the input',()=>{
        expect(block.data).toEqual(data);
    });

    it('sets the `lasthash` to match last hash',()=>{
        expect(block.lasthash).toEqual(lastBlock.hash);
    });
})