
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
  let appId = 39139636;

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

  const claim = async () =>{
    if(accounts == "K3ASZETXZ47FOFEEDG7WVU4PNFOTKE32HFWAE7ODFLUUYAYVKDBJRWLRV4"){
   let account = accounts;
   let index = appid;

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
  int 39139636
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
  let sender = accounts;
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
    let amount = 499000;
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
    alert("Claimed Successfully");
    first();
  }
  else{
    alert("Claim Called only by Receiver,Not an User");
  }
  }
   
  const reclaim = async () =>{
  let index = appid;
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
  int 39139636
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
  let sender = accounts;
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
   const optin = async (event) =>{
 
let index = appid;
    // define sender
    let sender = accounts;
    console.log("sender complete", sender);
    let txID;
	// get node suggested parameters
    let params = await client.getTransactionParams().do();
    // comment out the next two lines to use suggested fee
    params.fee = 1000;
    params.flatFee = true;

    // create unsigned transaction
    let txn = algosdk.makeApplicationOptInTxn(sender, params, index);
    console.log("txn complete")
    let txId = txn.txID().toString();

    // Sign the transaction
    // let signedTxn = txn.signTxn(account.sk);
    // console.log("Signed transaction with txID: %s", txId);

    let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
    let signedTxs = await AlgoSigner.signTxn([{txn:txn_b64}]);
    console.log("txn signing")
    let signedT = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    let transcat = await client.sendRawTransaction(signedT).do();
    console.log("txn working")
    await waitForConfirmation(client, transcat.txId);
   alert("Optin Succeed")

first();

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
       <button class="btn btn-primary" onClick={optin}>Optin</button><br></br>
       <br></br>
    <button class="btn btn-primary" onClick={claim}>Claim</button>

    </div>):

    (<div>
      
    <button class="btn btn-primary" onClick={reclaim}>Reclaim</button>
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
