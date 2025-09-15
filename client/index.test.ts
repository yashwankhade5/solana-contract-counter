import { expect,test } from "bun:test";
import { Connection, Enum, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { GREETING_size, schema,CounterAccount } from "./type";
import { connect } from "bun";
import bs58  from "bs58";
import * as borsh from "borsh";


const programId = new PublicKey("8W1Xfw9pi84buCWQmrP4HNbfPmqgCx2iSg81xprLYsZB");


let adminKeypair = Keypair.fromSecretKey(new Uint8Array([58,133,91,112,114,19,151,73,77,2,22,209,226,163,40,194,43,176,85,218,177,231,97,160,100,60,227,91,79,2,220,177,241,162,64,92,16,91,44,71,242,52,110,9,33,221,15,198,51,69,189,252,135,246,63,239,196,123,145,31,52,69,96,161]));

let counterAccount =  Keypair.generate();

  const connection =new Connection("https://api.devnet.solana.com","confirmed");
test('counter account initialize', async() => {
   const minrent =  await connection.getMinimumBalanceForRentExemption(GREETING_size);
   const bal = await connection.getBalance(adminKeypair.publicKey)
   console.log(`balance: ${bal}`)


   const txn = new Transaction().add(
    SystemProgram.createAccount({
        fromPubkey:adminKeypair.publicKey,
        newAccountPubkey:counterAccount.publicKey,
        lamports:minrent,
        space:GREETING_size,
        programId 

    })
   )
const signature = await sendAndConfirmTransaction(connection,txn,[adminKeypair,counterAccount])

const counterAccountinfo = await connection.getAccountInfo(counterAccount.publicKey);
if (!counterAccountinfo) {
  throw new Error("Counter account not found")
}

const counter =borsh.deserialize(schema,counterAccountinfo.data) as CounterAccount
console.log(counter.count);
    expect(counter.count).toBe(0);

})





