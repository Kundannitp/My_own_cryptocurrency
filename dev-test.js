// const Block=require('./Block');

// const block=new Block('10000','jdodjgore','gregreg','regergr');

// //console.log(block.toString());

// //console.log(Block.genesis().toString());

// const fooBlock=Block.mineBlock(Block.genesis(),'foo');

// console.log(fooBlock.toString());



// const Blockchain=require('./blockchain');

// const bc=new Blockchain();

// for(let i=0;i<10;i++){
//     const block=bc.addBlock(`the block is at ${i}`);

//     console.log(block.toString());
    
// }

const wallet=require('./walet');

const wal=new wallet();

console.log(wal.toString());


