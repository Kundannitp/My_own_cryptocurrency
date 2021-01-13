const Blockchain=require('.');
const Block=require('./Block');

describe('Blockchain',()=>{
    let bc,bc2;
    beforeEach(()=>{
        bc=new Blockchain();
        bc2=new Blockchain();
    });

    it("Blockchain starts with genesis block",()=>{
        expect(bc.chain[bc.chain.length-1]).toEqual(Block.genesis());
    });

    it("One block added to chain",()=>{
        let data="Kundan";
        let block1=bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1]).toEqual(block1);
    });

    it("Block chain is not corrupt",()=>{
        bc2.addBlock("testing");
        expect(bc.validChain(bc2.chain)).toEqual(true);
    });

    it("Block chain genesis get corrupted",()=>{
        bc2.addBlock("testing");
        bc2.chain[0].data="i am corrupting";
        expect(bc.validChain(bc2.chain)).toEqual(false); 
    });

    it('Block chain corrupted in between',()=>{
        bc2.addBlock("another testing");
        bc2.chain[1].data="corrupyion from inside";
        expect(bc.validChain(bc2.chain)).toEqual(false);
    });

    it("replacechain validation",()=>{
        let bc1=new Blockchain();
        bc1.addBlock("Kundan Kumar Jha");
        let bc3=new Blockchain();
        bc3.addBlock("kkj");
        bc3.addBlock("to all the persons betrated me in my life");
        bc3.addBlock("i have always tired of playing this dirty politics");
        bc3.replaceChain(bc1.chain);
        expect(bc1.chain).not.toEqual(bc3.chain);
    });

});