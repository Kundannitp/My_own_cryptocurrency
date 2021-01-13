const EC=require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const uuidv4=require('uuid/v4');

const ec=new EC('secp256k1');

class chainUtil{
    static getkeyspair(){
        return ec.genKeyPair();
    }

    static getId(){
        return uuidv4();
    }

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publickey,signature,hashdata){
        return ec.keyFromPublic(publickey,'hex').verify(hashdata,signature);
    }
}

module.exports=chainUtil;