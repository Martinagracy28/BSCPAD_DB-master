
/* global AlgoSigner */
import { signLogicSigTransactionObject } from 'algosdk';
//import React from 'react';
import React, { Component } from 'react';
//import secondpage from './secondpage';
import './App.css';
import web3 from './web3';
import { useEffect } from "react";
import { useState } from "react";
import tokencontract from './tokencontract';
import TESTToken from './TESTToken';
import { Card } from 'react-bootstrap';

global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');
//import Background from '../src/images/aa.gif'
//import TEST from './TEST';
//import {BrowserRouter as Router , Route , Link , Switch , NavLink} from "react-router-dom";
//import Background2 from '../src/images/logo1.png'

function FirstApp() {
  const [accounts, setaccount] = useState("");
  let[stardt,setstartdt] = useState("");
  const[enddt,setenddt] = useState("");
  const[clsdt,setclsdt] = useState("");
  const[goal,setgoal] = useState("");
  const[total,settotal] = useState("");
  const[rec,setrec]= useState("");
  const[owner,setowner]= useState("");
  const[escrow,setescrow]= useState("");
  const[appid,setappid]= useState("");
  let appId = 34658457;

  // user declared algod connection parameters
  //purestake api used
  let algodServer = "https://testnet-algorand.api.purestake.io/ps2";
  let algodToken = {
    'X-API-Key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl'
  };

  let algodPort = "";
  
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
 
  
// read local state of application from user account
async function readLocalState(client, account, index){
  let accountInfoResponse = await client.accountInformation(account).do();
  // let val = await client.ApplicationInformation(appId);
  // console.log("val",val)
  console.log("accinfo",accountInfoResponse);
  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      if (accountInfoResponse['apps-local-state'][i].id == index) {
          console.log("User's local state:");
          for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
              console.log(accountInfoResponse['apps-local-state'][i][`key-value`][n]);
          }
      }
  }
  for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
    if (accountInfoResponse['created-apps'][i].id == index) {
        console.log("Application's global state:");
        for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
            console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
            let enc = accountInfoResponse['created-apps'][i]['params']['global-state'][n];
            var decodedString = window.atob(enc.key);
            if(decodedString == "StartDate"){
              setstartdt(enc.value.uint);
            }
            else if(decodedString == "EndDate"){
              setenddt(enc.value.uint);
            }
            else if(decodedString == "FundCloseDate"){
              setclsdt(enc.value.uint);
            }
            else if(decodedString == "Total"){
              settotal(enc.value.uint);
            }
            else if(decodedString == "Goal"){
              setgoal(enc.value.uint);
            }
            else if(decodedString == "Receiver"){
              setrec(enc.value.bytes);
            }
            else if(decodedString == "Creator"){
              setowner(enc.value.bytes);
            }
            else if(decodedString == "Escrow"){
              setescrow(enc.value.bytes);
            }
            
            console.log("decoded",decodedString);
        }
        
    }
}
}
// // read global state of application
// async function readGlobalState(client, account, index){
//   let accountInfoResponse =  client.accountInformation(account).do();
//    console.log("accinfo",accountInfoResponse);
//   for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
//       if (accountInfoResponse['created-apps'][i].id == index) {
//           console.log("Application's global state:");
//           for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
//               console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
//               let enc = accountInfoResponse['created-apps'][i]['params']['global-state'][n];
//               var decodedString = window.atob(enc.key);
//               setkey.push(decodedString);
//               setvalue.push(enc.value);
//               console.log(decodedString);
//           }
//       }
//   }
// }
const first = async () => {
  var account = localStorage.getItem("wallet");
  console.log("wallet,",account)
  setaccount(account)
  setappid(appId);
  // read local state of application from user account
    await readLocalState(client, account, appId);
    // read global state of application
    // var account = localStorage.getItem("wallet");
    // await readGlobalState(client, account, appId);   
  }
  useEffect(() =>{first()},[accounts])
    
 
  const claim = async () =>{

  
// declare application state storage (immutable)
// let localInts = 1;
// let localBytes = 0;
// let globalInts = 5;
// let globalBytes = 3;

//var fs = require('fs'),



// helper function to compile program source  
// async function compileProgram(client, programSource) {
//     let encoder = new TextEncoder();
//     let programBytes = encoder.encode(programSource);
//     let compileResponse = await client.compile(programBytes).do();
//     let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
//     return compiledBytes;
// }

// helper function to await transaction confirmation
// Function used to wait for a tx confirmation
const waitForConfirmation = async function (client, txId) {
    let status = (await client.status().do());
    let lastRound = status["last-round"];
      while (true) {
        const pendingInfo = await client.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
          //Got the completed Transaction
          console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
          break;
        }
        lastRound++;
        await client.statusAfterBlock(lastRound).do();
      }
    };



async function claimApp(account, index, amount) {

  var escrowdata = `#pragma version 2
  global GroupSize
  int 2
  ==
  // The first transaction must be 
  // an ApplicationCall (ie call stateful smart contract)
  gtxn 0 TypeEnum
  int 6
  ==
  &&
  // The specific App ID must be called
  // This should be changed after creation
  gtxn 0 ApplicationID
  int 37005781
  ==
  &&
  // The applicaiton call must either be
  // A general applicaiton call or a delete
  // call
  gtxn 0 OnCompletion
  int NoOp
  ==
  int DeleteApplication
  gtxn 0 OnCompletion
  ==
  ||
  &&
  // verify neither transaction
  // contains a rekey
  gtxn 1 RekeyTo
  global ZeroAddress
  ==
  &&
  gtxn 0 RekeyTo
  global ZeroAddress
  ==
  &&
  `;
    
  // define sender
  let sender = account;
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

 // get node suggested parameters
  let params = await client.getTransactionParams().do();
  // comment out the next two lines to use suggested fee
  params.fee = 1000;
  params.flatFee = true;

  let appArgs = [];
  appArgs.push(new Uint8Array(Buffer.from("claim")));
  console.log("(line:516) appArgs = ",appArgs)

  // create unsigned transaction
  let transaction1 = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs)
  //  let txId1 = transaction1.txID().toString();

  let results = await client.compile(escrowdata).do();
  console.log("Hash = " + results.hash);
  console.log("Result = " + results.result);
  let program = new Uint8Array(Buffer.from(results.result, "base64"));
  let args = [];
    args.push(algosdk.encodeUint64(123));

    let lsig = algosdk.makeLogicSig(program, args);
    

let sender1 = lsig.address();
console.log("logic",sender1)
    let receiver = sender;
    // let receiver = "<receiver-address>"";
    
    let closeToRemaninder = sender;
    let note = undefined;
    let transaction2 = algosdk.makePaymentTxnWithSuggestedParams(sender1, receiver, amount, closeToRemaninder, note, params)
    
    let txns = [transaction1, transaction2];
    let txgroup = algosdk.assignGroupID(txns);
    console.log("group = ", txgroup);
    let txn_b64_1 = transaction1.toByte();
    let txn_b64_2 = transaction2.toByte();
    // let base64Txs1 =  AlgoSigner.encoding.msgpackToBase64(txn_b64_1);
    let base64Txs2 =  AlgoSigner.encoding.msgpackToBase64(txn_b64_2);
    console.log("signing")
    
    let base64Txs1 = AlgoSigner.encoding.msgpackToBase64(txn_b64_1);
    
    let signedTxs = await AlgoSigner.signTxn([
      {
        txn: base64Txs1,
      }
    ]);
    console.log("logic",signedTxs)
    let rawSignedTxn = algosdk.signLogicSigTransactionObject(transaction2, lsig);
    let binarySignedTxs =  AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    //let binarySignedTxs = signedTxs.map((txn) => AlgoSigner.encoding.base64ToMsgpack(txn[0].blob));
    let signArr = [binarySignedTxs,rawSignedTxn.blob];
    console.log("signed",rawSignedTxn.blob)
    let trans = await client.sendRawTransaction(signArr).do();
     console.log("Send complete");
  //   console.log("txID", trans);
     console.log("id", trans.txId);
   await waitForConfirmation(client, trans.txId);
    console.log("signed")
    
}





async function main() {
    try {
    // initialize an algodClient
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

   
    // compile programs 
    // let approvalProgram = await compileProgram(algodClient, approvalProgramSourceInitial);
    // let clearProgram = await compileProgram(algodClient, clearProgramSource);

    // create new application
    //let appId = await createApp(algodClient, creatorAccount, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes);
    let appId = 37005781;
    // opt-in to application
    // await optInApp(algodClient, userAccount, appId);
let accounts;
    AlgoSigner.connect()
    .then((d) => {
      AlgoSigner.accounts({
        ledger: 'TestNet'
      })
      .then(async (d) => {
        accounts = d;
        let amount = 1000000;
        await claimApp(accounts[1].address, appId , amount);
      })
      .catch((e) => {
        console.error(e);
      });
    })
    .catch((e) => {
      console.error(e);
    });



    // // call application without arguments
 //atomic involved

    // // read local state of application from user account
    // await readLocalState(algodClient, userAccount, appId);

    // // read global state of application
    // await readGlobalState(algodClient, creatorAccount, appId);

    // // update application
    // approvalProgram = await compileProgram(algodClient, approvalProgramSourceRefactored);
    // await updateApp(algodClient, creatorAccount, appId, approvalProgram, clearProgram);

    // // call application with arguments
    // let ts = new Date(new Date().toUTCString());
    // console.log(ts)
    // let appArgs = [];
    // console.log("(line:516) appArgs = ",appArgs)
    // appArgs.push(new Uint8Array(Buffer.from(ts)));
    // await callApp(algodClient, userAccount, appId, appArgs);

    // read local state of application from user account
    // await readLocalState(algodClient, userAccount, appId);

    // // close-out from application
    // await closeOutApp(algodClient, userAccount, appId)

    // // opt-in again to application
    // await optInApp(algodClient, userAccount, appId)

    // // call application with arguments
    // await callApp(algodClient, userAccount, appId, appArgs)

    // // read local state of application from user account
    // await readLocalState(algodClient, userAccount, appId);

    // // delete application
    // await deleteApp(algodClient, creatorAccount, appId)

    // // clear application from user account
    // await clearApp(algodClient, userAccount, appId)

    }
    catch (err){
        console.log("err", err);  
    }
}

main();


  }
   
  const reclaim = async () =>{
     
 
// declare application state storage (immutable)
// let localInts = 1;
// let localBytes = 0;
// let globalInts = 5;
// let globalBytes = 3;

//var fs = require('fs'),



// helper function to compile program source  
// async function compileProgram(client, programSource) {
//     let encoder = new TextEncoder();
//     let programBytes = encoder.encode(programSource);
//     let compileResponse = await client.compile(programBytes).do();
//     let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
//     return compiledBytes;
// }

// helper function to await transaction confirmation
// Function used to wait for a tx confirmation
const waitForConfirmation = async function (client, txId) {
    let status = (await client.status().do());
    let lastRound = status["last-round"];
      while (true) {
        const pendingInfo = await client.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
          //Got the completed Transaction
          console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
          break;
        }
        lastRound++;
        await client.statusAfterBlock(lastRound).do();
      }
    };



async function reclaimApp(account, index, amount) {

  var escrowdata = `#pragma version 2
  global GroupSize
  int 2
  ==
  // The first transaction must be 
  // an ApplicationCall (ie call stateful smart contract)
  gtxn 0 TypeEnum
  int 6
  ==
  &&
  // The specific App ID must be called
  // This should be changed after creation
  gtxn 0 ApplicationID
  int 38490519
  ==
  &&
  // The applicaiton call must either be
  // A general applicaiton call or a delete
  // call
  gtxn 0 OnCompletion
  int NoOp
  ==
  int DeleteApplication
  gtxn 0 OnCompletion
  ==
  ||
  &&
  // verify neither transaction
  // contains a rekey
  gtxn 1 RekeyTo
  global ZeroAddress
  ==
  &&
  gtxn 0 RekeyTo
  global ZeroAddress
  ==
  &&
  `;
    
  // define sender
  let sender = account;
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);

 // get node suggested parameters
  let params = await client.getTransactionParams().do();
  // comment out the next two lines to use suggested fee
  params.fee = 1000;
  params.flatFee = true;

  let appArgs = [];
  appArgs.push(new Uint8Array(Buffer.from("reclaim")));
  console.log("(line:516) appArgs = ",appArgs)

  // create unsigned transaction
 
  //  let txId1 = transaction1.txID().toString();

  let results = await client.compile(escrowdata).do();
  console.log("Hash = " + results.hash);
  console.log("Result = " + results.result);
  let program = new Uint8Array(Buffer.from(results.result, "base64"));
  let args = [];
    args.push(algosdk.encodeUint64(123));

    let lsig = algosdk.makeLogicSig(program, args);
    

let sender1 = lsig.address();
let accounts =[];
accounts.push(sender1);
let transaction1 = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs,accounts)
console.log("logic",sender1)
    let receiver = sender;
    // let receiver = "<receiver-address>"";
    
    let closeToRemaninder = undefined;
    let note = undefined;
    let transaction2 = algosdk.makePaymentTxnWithSuggestedParams(sender1, receiver, 0, closeToRemaninder, note, params)
    
    let txns = [transaction1, transaction2];
    let txgroup = algosdk.assignGroupID(txns);
    console.log("group = ", txgroup);
    let txn_b64_1 = transaction1.toByte();
    let txn_b64_2 = transaction2.toByte();
    // let base64Txs1 =  AlgoSigner.encoding.msgpackToBase64(txn_b64_1);
    let base64Txs2 =  AlgoSigner.encoding.msgpackToBase64(txn_b64_2);
    console.log("signing")
    
    let base64Txs1 = AlgoSigner.encoding.msgpackToBase64(txn_b64_1);
    
    let signedTxs = await AlgoSigner.signTxn([
      {
        txn: base64Txs1,
      }
    ]);
    console.log("logic",signedTxs)
    let rawSignedTxn = algosdk.signLogicSigTransactionObject(transaction2, lsig);
    let binarySignedTxs =  AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    //let binarySignedTxs = signedTxs.map((txn) => AlgoSigner.encoding.base64ToMsgpack(txn[0].blob));
    let signArr = [binarySignedTxs,rawSignedTxn.blob];
    console.log("signed",signArr)
    let trans = await client.sendRawTransaction(signArr).do();
     console.log("Send complete");
  //   console.log("txID", trans);
     console.log("id", trans.txId);
   await waitForConfirmation(client, trans.txId);
    console.log("signed")
    
}





async function main() {
    try {
    // initialize an algodClient
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

   
    // compile programs 
    // let approvalProgram = await compileProgram(algodClient, approvalProgramSourceInitial);
    // let clearProgram = await compileProgram(algodClient, clearProgramSource);

    // create new application
    //let appId = await createApp(algodClient, creatorAccount, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes);
    let appId = 38490519;
    // opt-in to application
    // await optInApp(algodClient, userAccount, appId);
let accounts;
    AlgoSigner.connect()
    .then((d) => {
      AlgoSigner.accounts({
        ledger: 'TestNet'
      })
      .then(async (d) => {
        accounts = d;
        let amount = 499000;
        await reclaimApp(accounts[3].address, appId , amount);
      })
      .catch((e) => {
        console.error(e);
      });
    })
    .catch((e) => {
      console.error(e);
    });



    }
    catch (err){
        console.log("err", err);  
    }
}

main();

  }
 
    return (
      <div class=" text App" style={{backgroundColor:'black'}}>
       
       <br/>
       
       <h3 id="demo" class="time" style={{textAlign:"center"}}>
</h3>
        <h2 class="head"><b>COMPLETED PROJECTS</b></h2>
        <br/>  <br/>
        <div class="container">
       
        <div class="row ">

          <div class="col-4  align-self-center">
          <Card class="mt-4  shadow" style={{ width: '75rem' , padding: "15px",backgroundColor:" black",boxShadow:"0px 0px 15px pink"}}  >
          <h3>
 <b> APPID</b>  <br/> <span class="spantext"id="main1">{appid}</span>
</h3><p class="tiny" id="main5"></p>

<p id="dem" class="pp">

</p>
<h3>
  <b>Goal Amount(ALGOS) </b><br/> <span class="spantext"id="main2">{goal/1000000} </span>
</h3><p class="tiny"id="ap"></p>
<p class="tiny"id="ap1"></p>

<h3>
   <b>Total Amount Reached</b> <br/><span class="spantext"id="main3">{total/1000000} </span>
</h3><br/> 
<p class="tiny" id="main"></p>

{/* <h3>
   <b>Owner Address</b> <br/><span class="spantext"id="main3">{window.atob(owner)} </span>
</h3><br/> 
<p class="tiny" id="main"></p>
<h3>
   <b>Fund Receiver</b> <br/><span class="spantext"id="main3">{window.atob(rec)} </span>
</h3><br/> 
<p class="tiny" id="main"></p> */}
<div>
    { total >= goal ?(
    <div>
    <button class="btn btn-primary">Claim</button>

    </div>):

    (<div>
    <button class="btn btn-primary">Reclaim</button>
    </div>)
    }
</div>

</Card>

         </div>
         
         

        </div>
        
     </div>
        <br/> 
        <br/>
      
       
        
        </div>
    );
  }



export default FirstApp;
