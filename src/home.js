
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
import { setDayWithOptions } from 'date-fns/fp';
import fireDB from './firebase';
import { createBootstrapComponent } from 'react-bootstrap/esm/ThemeProvider';

global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');

// async function compileProgram(client, programSource) {
//   let encoder = TextEncoder;
//   let programBytes = encoder.encode(programSource);
//   let compileResponse = await client.compile(programBytes).do();
//   let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
//   return compiledBytes;
// }
//import Background from '../src/images/aa.gif'
//import TEST from './TEST';
//import {BrowserRouter as Router , Route , Link , Switch , NavLink} from "react-router-dom";
//import Background2 from '../src/images/logo1.png'

let appId = null;

function Home() {
  const [accounts, setaccount] = useState("");
  let[stardt,setstartdt] = useState("");
  const[enddt,setenddt] = useState("");
  const[clsdt,setclsdt] = useState("");
  const[goal,setgoal] = useState("");
  const[total,settotal] = useState("");
  const[rec,setrec]= useState("");
  const[creator,setCreator]= useState("");
  const[escrow,setescrow]= useState("");
  const[appid,setappid]= useState("");
  const[opt,setopt] = useState("");
  const[inp_sDate, set_inp_sDate] = useState("");
  const[inp_eDate, set_inp_eDate] = useState("");
  const[inp_goal, set_inp_goal] = useState("");
  //let appId;

 


  // user declared algod connection parameters
  //purestake api used
  let algodServer = "https://testnet-algorand.api.purestake.io/ps2";
  let algodToken = {
    'X-API-Key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl'
  };

  let algodPort = "";
  
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
 
  const createApp = async (start_date, end_date, goal_amt) => {

    let approvalProgramSourceInitial = `#pragma version 5


    //need to hard code 1 address while create app
    
    
    
    // Fund Start Date unixtimestamp
    // Fund End Date unixtimestamp
    // Fund Goal
    // Fund Amount - total
    // Escrow Address
    // Creator Address
    
    // check if the app is being created
    // if so save creator
    byte "SSMNQOS6TE6LQKE5ANEAQUH62HFLKNTD57FI2FAWIMIRUZUVZUILP3TTCYEGUSS7HHM3ODVPW3Z2L55WPCZCR4TWSN2VVAKYPZKYEUER5BXM5N6YNH7I"
    store 2
    int 2
    store 7
    int 0
    store 4
    int 0
    txn ApplicationID
    ==
    bz not_creation
    byte "Creator"
    txn Sender
    app_global_put
    //4 args on creation
    // transaction will fail
    // if 4 args are not passed during creation
    txn NumAppArgs
    int 5
    ==
    bz failed
    byte "StartDate"
    txna ApplicationArgs 0
    btoi
    app_global_put
    byte "EndDate"
    txna ApplicationArgs 1
    btoi
    app_global_put
    byte "Goal"
    txna ApplicationArgs 2
    btoi
    app_global_put
    byte "Receiver"
    txna ApplicationArgs 3
    app_global_put
    byte "Total"
    int 0
    app_global_put
    byte "FundCloseDate"
    txna ApplicationArgs 4
    btoi
    app_global_put
    int 1
    return
    not_creation:
    // check if this is deletion transaction
    int DeleteApplication
    txn OnCompletion
    ==
    bz not_deletion
    // To delete the app
    // The creator must empty the escrow
    // to the fund receiver if the escrow has funds
    // only the creator
    // can delete the app
    byte "Creator"
    app_global_get
    txn Sender
    ==
    // check that we are past fund close date
    global LatestTimestamp
    byte "FundCloseDate"
    app_global_get
    >=
    &&
    bz failed
    // if escrow balance is zero
    // let the app be deleted
    // escrow account must be passed
    // into the call as an argument
    int 0
    int 1
    balance
    ==
    // if the balance is 0 allow the delete
    bnz finished
    // if the escrow is not empty then
    // there must be need two transactions
    // in a group
    global GroupSize
    int 2
    ==
    // second tx is an payment
    gtxn 1 TypeEnum
    int 1
    ==
    &&
    // the second payment transaction should be
    // a close out transaction to receiver
    byte "Receiver"
    app_global_get
    gtxn 1 CloseRemainderTo
    ==
    &&
    // the amount of the payment transaction
    // should be 0
    gtxn 1 Amount
    int 0
    ==
    &&
    // the sender of the payment transaction
    // should be the escrow account
    byte "Escrow"
    app_global_get
    gtxn 1 Sender
    ==
    &&
    bz failed
    int 1
    return
    not_deletion:
    //---
    // check if this is update ---
    int UpdateApplication
    txn OnCompletion
    ==
    bz not_update
    // verify that the creator is
    // making the call
    byte "Creator"
    app_global_get
    txn Sender
    ==
    // the call should pass the escrow
    // address
    txn NumAppArgs
    int 1
    ==
    &&
    bz failed
    // store the address in global state
    // this parameter should be addr:
    byte "Escrow"
    txna ApplicationArgs 0
    app_global_put
    int 1
    return
    not_update:
    //---
    // check for closeout
    int CloseOut
    txn OnCompletion
    ==
    bnz close_out
    // check if no params are
    // passed in, which should
    // only happen when someone just
    // wants to optin
    // note the code is written
    // to allow opting in and donating with
    // one call
    int 0
    txn NumAppArgs
    ==
    bz check_parms
    // Verify someone is
    // not just opting in
    int OptIn
    txn OnCompletion
    ==
    bz failed
    int 1
    return
    check_parms:
    // donate
    gtxna 0 ApplicationArgs 0
    byte "donate"
    ==
    gtxn 1 Amount
    byte "Total"
    app_global_get
    +
    byte "Goal"
    app_global_get
    <=
    &&
    bnz donators
    // reclaim
    txna ApplicationArgs 0
    byte "reclaim"
    ==
    bnz reclaim
    // claim
    txna ApplicationArgs 0
    byte "claim"
    ==
    bnz claim
    // Add address
    txna ApplicationArgs 0
    byte "adding"
    ==
    bnz adding
    b failed
    
    adding:
    byte "Creator"
    app_global_get
    txn Sender
    ==
    bz failed
    bnz concat_1
    
    concat_1:
    load 2
    txna Accounts 0
    concat
    store 2
    txna ApplicationArgs 1
    store 7
    int 1
    return
    
    
    donate:
    // check dates to verify
    // in valid range
    
    global LatestTimestamp
    byte "StartDate"
    app_global_get
    >= //l >= s
    global LatestTimestamp
    byte "EndDate"
    app_global_get
    <=
    &&
    bz failed
    // check if grouped with
    // two transactions
    global GroupSize
    int 2
    ==
    // second tx is an payment
    gtxn 1 TypeEnum
    int 1
    ==
    &&
    bz failed
    // verify escrow is receiving
    // second payment tx
    byte "Escrow"
    app_global_get
    gtxn 1 Receiver
    ==
    bz failed
    // increment the total
    // funds raised so far
    byte "Total"
    app_global_get
    gtxn 1 Amount
    +
    store 1
    byte "Total"
    load 1
    app_global_put
    // increment or set giving amount
    // for the account that is donating
    int 0 //sender
    txn ApplicationID
    byte "MyAmountGiven"
    app_local_get_ex
    // check if a new giver
    // or existing giver
    // and store the value
    // in the givers local storage
    bz new_giver
    gtxn 1 Amount
    +
    store 3
    int 0 //sender
    byte "MyAmountGiven"
    load 3
    app_local_put
    b finished
    new_giver:
    int 0 //sender
    byte "MyAmountGiven"
    gtxn 1 Amount
    app_local_put
    b finished
    
    
    
    claim:
    // verify there are 2 transactions
    // in the group
    global GroupSize
    int 2
    ==
    bz failed
    // verify that the receiver
    // of the payment transaction
    // is the address stored
    // when the fund was created
    gtxn 1 Receiver
    byte "Receiver"
    app_global_get
    ==
    // verify the sender
    // of the payment transaction
    // is the escrow account
    gtxn 1 Sender
    byte "Escrow"
    app_global_get
    ==
    &&
    // verify that the CloseRemainderTo
    // attribute is set to the receiver
    gtxn 1 CloseRemainderTo
    byte "Receiver"
    app_global_get
    ==
    &&
    // verify that the fund end date
    // has passed
    global LatestTimestamp
    byte "EndDate"
    app_global_get
    >
    &&
    bz failed
    // verify that the goal was reached
    byte "Total"
    app_global_get
    byte "Goal"
    app_global_get
    >=
    bz failed
    b finished
    
    donators:
    load 4
    load 7
    <
    bz failed
    int 58
    load 4
    *
    store 0
    load 2
    load 0
    int 58
    extract3
    store 6
    load 6
    gtxna 0 ApplicationArgs 1
    ==
    bnz donate
    load 4
    int 1
    +
    store 4
    b donators
    
    
    //bz donators
    //dont check amount because
    //escrow account may receiver
    //more than the goal
    //Could check for total vs tx1 amount
    
    //Fund did not meet total
    //Allow ppl to reclaim funds
    //may be an issue when the last
    //person relcaims because of min balance
    //without a closeto
    // only 1 relcaim tx is allowed per account
    reclaim:
    // verify there are 2 transactions
    // in the group
    global GroupSize
    int 2
    ==
    bz failed
    // verfiy that smart contract
    // caller is the payment
    // transction receiver
    gtxn 1 Receiver
    gtxn 0 Sender
    ==
    // Verify that payment
    // transaction is from the escrow
    gtxn 1 Sender
    byte "Escrow"
    app_global_get
    ==
    &&
    // verify that fund end date has passed
    global LatestTimestamp
    byte "EndDate"
    app_global_get
    >
    &&
    // verify the fund goal was
    // not met
    byte "Total"
    app_global_get
    byte "Goal"
    app_global_get
    <
    &&
    // because the escrow
    // has to pay the fee
    // the amount of the
    // payment transaction
    // plus the fee should
    // be less than or equal to
    // the amount originally
    // given
    gtxn 1 Amount //0.499000
    gtxn 1 Fee//0.001000 0.5
    +
    int 0 //0.5
    byte "MyAmountGiven"
    app_local_get //0.5
    <=         // 0.5 <= 0.5
    &&
    bz failed
    //check the escrow account total
    //--app-account for the escrow
    // needs to pass the address
    // of the escrow
    // check that this is the
    // last recoverd donation
    // if it is the closeremainderto
    // should be set
    gtxn 1 Fee
    gtxn 1 Amount
    +
    // the int 1 is the ref to escrow
    int 1
    balance
    ==
    gtxn 1 CloseRemainderTo
    global ZeroAddress
    ==
    ||
    bz failed
    // decrement the given amount
    // of the sender
    int 0
    byte "MyAmountGiven"
    app_local_get
    gtxn 1 Amount
    -
    gtxn 1 Fee
    -
    store 5
    int 0
    byte "MyAmountGiven"
    load 5
    app_local_put
    b finished
    //call if this is a closeout op
    close_out:
    int 1
    return
    failed:
    int 0
    return
    finished:
    int 1
    return`;

    let clearProgramSource = `#pragma version 5
    int 1
    return
    `;

    let approvalProgramCompiled = await client.compile(approvalProgramSourceInitial).do();
    let clearProgramCompiled = await client.compile(clearProgramSource).do();

    let approval = new Uint8Array(Buffer.from(approvalProgramCompiled.result, "base64"));
    let clear = new Uint8Array(Buffer.from(clearProgramCompiled.result, "base64"));

    let mySdDate = new Date(start_date.toString()); // Your timezone!
    let mySdEpoch = mySdDate.getTime()/1000.0;
    console.log("start date epoch = ", mySdEpoch);
    let myEdDate = new Date(end_date.toString()); // Your timezone!
    let myEdEpoch = myEdDate.getTime()/1000.0;
    console.log("epoch = ", myEdEpoch);
    let args = [];
    args.push(algosdk.encodeUint64(mySdEpoch));
    args.push(algosdk.encodeUint64(myEdEpoch));
    args.push(algosdk.encodeUint64(parseInt(goal_amt)));
    //args.push(new Uint8Array(Buffer.from(accounts)));
    let decAddr = algosdk.decodeAddress(accounts);
    args.push(decAddr.publicKey);
    args.push(algosdk.encodeUint64(myEdEpoch));

    client.getTransactionParams().do()
.then((d) => {
  let txParamsJS = d;
  const txn = algosdk.makeApplicationCreateTxnFromObject({
    from: accounts,
    approvalProgram: approval,
    clearProgram: clear,
    numGlobalByteSlices: 3,
    numGlobalInts: 5,
    numLocalByteSlices: 0,
    numLocalInts: 1,
    appArgs: args,
    note: undefined,
    suggestedParams: {...txParamsJS}
  });
  
  // Use the AlgoSigner encoding library to make the transactions base64
  let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
  
  AlgoSigner.signTxn([{txn: txn_b64}])
  .then((d) => {
    let signedTxs = d;
    AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTxs[0].blob
    })
    .then(async(d) => {
      let tx = d;
      console.log("txID = ", tx);
      await waitForConfirmation(client, tx.txId);
      client.pendingTransactionInformation(tx.txId).do()
      .then(async(d) => {
        console.log(d);
        let transactionResponse = d;
        console.log("tR = ", transactionResponse);
        appId = await transactionResponse['application-index'];
        localStorage.setItem("appId", appId);
        setappid(appId);
        console.log("appID = ", appId);
        let escrowdata = `#pragma version 5
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
      int appIDreplace
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
      let data2 = escrowdata.replace("appIDreplace", appId.toString());
      console.log("Escrow program =", data2);
      let results = await client.compile(data2).do();
      console.log("Hash = " + results.hash);
      console.log("Result = " + results.result);
      let escrowAddress = results.hash;
      localStorage.setItem("escrow", results.hash);
      let argsUpdate = [];
      let decAddr = algosdk.decodeAddress(results.hash);
      argsUpdate.push(decAddr.publicKey);

      //update start
      
      client.getTransactionParams().do()
      .then((d) => {
      let txParamsJS = d;
      const txn = algosdk.makeApplicationUpdateTxnFromObject({
      from: accounts,
      approvalProgram: approval,
      clearProgram: clear,
      appIndex: appId,
      appArgs: argsUpdate,
      note: undefined,
      suggestedParams: {...txParamsJS}
      });
      
      // Use the AlgoSigner encoding library to make the transactions base64
      let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
      
      AlgoSigner.signTxn([{txn: txn_b64}])
      .then((d) => {
      let signedTxs = d;
      AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTxs[0].blob
      })
      .then(async(d) => {
      let tx = d;
      console.log("txID = ", tx);
      
      let escrow_funder = accounts;
      let closeto = undefined;
      let note = undefined;
      let fund_amount = 100000;

      //fund escrow
      client.getTransactionParams().do()
      .then((d) => {
        let txParamsJS = d;
        console.log("Tx params : ",txParamsJS);
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: escrow_funder,
          to: escrowAddress,
          amount: parseInt(fund_amount),
          note: undefined,
          suggestedParams: {...txParamsJS}
        });
      
        
        // Use the AlgoSigner encoding library to make the transactions base64
        let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
        
        
        AlgoSigner.signTxn([{txn: txn_b64}])
      
        .then((d) => {
          signedTxs = d;
          AlgoSigner.send({
            ledger: 'TestNet',
            tx: signedTxs[0].blob
          })
          .then((d) => {
            let txID = d;
            console.log(txID);
            console.log("Escrow Funded successfully")
          })
          .catch((e) => {
            console.error(e);
          });
        })
         
         .catch((e) => {
             console.error(e);
         });
       })
      .catch((e) => {
        console.error(e);
      });
      //fund escrow over

      })
      .catch((e) => {
      console.error(e);
      });
      })
      .catch((e) => {
      console.error(e);
      });
      })
      .catch((e) => {
      console.error(e);
      });
      //update end
      })
      .catch((e) => {
        console.error(e);
      });

    })
    .catch((e) => {
      console.error(e);
    });
  })
  .catch((e) => {
      console.error(e);
  });
})
.catch((e) => {
  console.error(e);
});
}

const globalState = async (client, index) =>
{
      try {
        const r = await AlgoSigner.indexer({
          ledger: 'TestNet',
          path: `/v2/applications/${index}`
        });
        console.log("R value", r);
        setrec(JSON.stringify(r['application']['params']['global-state'][0]['value'][`bytes`]));
        setstartdt(JSON.stringify(r['application']['params']['global-state'][1]['value'][`uint`]));
        settotal(JSON.stringify(r['application']['params']['global-state'][2]['value'][`uint`]));
        setCreator(JSON.stringify(r['application']['params']['global-state'][3]['value'][`bytes`]));
        setenddt(JSON.stringify(r['application']['params']['global-state'][4]['value'][`uint`]));
        setclsdt(JSON.stringify(r['application']['params']['global-state'][5]['value'][`uint`]));
        setgoal(JSON.stringify(r['application']['params']['global-state'][6]['value'][`uint`]));
        setescrow(JSON.stringify(r['application']['params']['global-state'][7]['value'][`bytes`]));
        //return JSON.stringify(r['application']['params']['global-state'][7]['value'][`bytes`], null, 2);
      } catch (e) {
        console.error(e);
        return JSON.stringify(e, null, 2);
      }
}

  

// read local state of application from user account
async function readLocalState(client, account, index){
  let accountInfoResponse = await client.accountInformation(account).do();
  // let val = await client.ApplicationInformation(appId);
  // console.log("val",val)
  console.log("accinfo",accountInfoResponse);
  
  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      if (accountInfoResponse['apps-local-state'][i].id == index) {
          // 
          setopt(false);
        console.log("wo")
      }
      else{
        setopt(true);
        console.log("wo1")
      }
  }
   accountInfoResponse = await client.accountInformation("4J7CTNWLAHEA2TN3GTJXQF2HPF7CD3FQJ3FQP6E7IUJPO3NTVGE5IBO5DU").do();
  for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
    if (accountInfoResponse['created-apps'][i].id == index) {
        console.log("Application's global state:");
        for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
            console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
            let enc = accountInfoResponse['created-apps'][i]['params']['global-state'][n];
            var decodedString = window.atob(enc.key);
            // if(decodedString == "StartDate"){
            //   setstartdt(enc.value.uint);
            // }
            // else if(decodedString == "EndDate"){
            //   setenddt(enc.value.uint);
            // }
            // else if(decodedString == "FundCloseDate"){
            //   setclsdt(enc.value.uint);
            // }
           if(decodedString == "Total"){
              settotal(enc.value.uint);
            }
            else if(decodedString == "Goal"){
              setgoal(enc.value.uint);
            }
            // else if(decodedString == "Receiver"){
            //   setrec(enc.value.bytes);
            // }
            // else if(decodedString == "Creator"){
            //   setowner(enc.value.bytes);
            // }
            // else if(decodedString == "Escrow"){
            //   setescrow(enc.value.bytes);
            // }
            
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
// function sleep(seconds){
//   var waitUntil = new Date().getTime() + seconds*1000;
//   while(new Date().getTime() < waitUntil) 
//       true;
// }

// sleep(20000);

useEffect(() =>{first()},[goal, stardt, enddt, total])

const first = async () => {
  
//   var firebase= fireDB.database().ref("Appid");
//   console.log("firebase",(firebase))

//   firebase.child("45380830").once("value", function(snapshot) {
//     console.log(snapshot.val());
//     console.log("closed",snapshot.val().closed)
//    setstartdt(snapshot.val().startdate);
//    setclsdt(snapshot.val().enddate)
   
//   }, function (error) {
//     console.log("Error: " + error.code);
//  });
 


  var account = localStorage.getItem("wallet");
  console.log("wallet,",account)
  setaccount(account)
  let appid = localStorage.getItem("appId");
  // read local state of application from user account
    //await readLocalState(client, account, appid);
   
    // read global state of application
    // var account = localStorage.getItem("wallet");
    await globalState(client, appid);   
  }
  
    
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
   const optin = async (event) =>{

    // define sender
    let sender = accounts;
    let index = parseInt(localStorage.getItem("appId"));
     console.log("appid",index);
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
    let txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte());
    let signedTxs = await AlgoSigner.signTxn([{txn:txn_b64}]);
    console.log("txn signing")
    let signedT = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    let transcat = await client.sendRawTransaction(signedT).do();
    console.log("txn working")
    await waitForConfirmation(client, transcat.txId);
    alert("optin Completed");
    first();
  var firebase= fireDB.database().ref("optinAddress");
firebase.push({accounts});
console.log("pushed")
     } 
  
 
    return (
      
      <div class=" text App" style={{backgroundColor:'black'}}>
       
       <br/>
       
       <h3 id="demo" class="time" style={{textAlign:"center"}}>
</h3>
        <h2 class="head"><b>CROWDFUNDING</b></h2>
        <br/>  <br/>
        <div class="container" style={{backgroundColor:'black'}}>
        <label> Description : </label> 
        <input
        id="desc"
        type='text'
        placeholder='Enter The Reason'
        name="desc"  
        /><br/>
        <label> start date : </label> 
        <input
        id="stDate"
        type='text'
        placeholder='Enter The Start Date'
        name="desc"
        required
        onChange={event => set_inp_sDate(event.target.value)}  
        /><br/>
        <label> end date : </label> 
        <input
        id="edDate"
        type='text'
        placeholder='Enter The End Date'
        name="desc"
        required
        onChange={event => set_inp_eDate(event.target.value)}  
        /><br/>
        <label> Goal Amount : </label> 
        <input
        id="goal"
        type='number'
        placeholder='Enter The Goal amount'
        name="desc"
        required
        onChange={event => set_inp_goal(event.target.value)}  
        /><br/>

        <button class="btn btn-primary" onClick={()=> createApp(inp_sDate, inp_eDate, inp_goal)}>start fund raising</button><br/><br/>
        <div class="row justify-content-center" style={{backgroundColor:'black'}}>

          <div class="col-4  align-self-center" style={{backgroundColor:'black'}}>
          <Card class="mt-2  shadow" style={{ width: '25rem' ,height:'50rem', padding: "30px",backgroundColor:"black",boxShadow:"0px 0px 15px pink"}}  >
          <h3>
 <b> APPID</b>  <br/> <span class="spantext"id="main1">{localStorage.getItem("appId")}</span>
</h3><p class="tiny" id="main5"></p>

  <div style={{backgroundColor:'black'}}>
    {/* { opt == true ?(<div style={{backgroundColor:'black'}}> 
      <h3>Before Proceed ,optin first</h3><br></br>
      <button class="btn btn-primary" onClick={optin}>Optin</button>
      </div>):(*/}
        <div>
    <h3>Before Proceed ,optin first</h3><br></br>
      <button class="btn btn-primary" onClick={optin}>Optin</button><br></br>
<h3>    
 <b> Fund Start Date</b>  <br/> <span class="spantext"id="main2">{(new Date(stardt*1000)).toLocaleString()}</span>
</h3><p class="tiny" id="main5"></p>
<p class="tiny"id="main6"></p>
<p id="dem" class="pp">

</p>
<h3>
  <b>Goal Amount(ALGOS) </b><br/> <span class="spantext"id="main3">{goal/1000000} </span>
</h3><p class="tiny"id="ap"></p>
<p class="tiny"id="ap1"></p>

<h3>
   <b>Total Amount Reached</b> <br/><span class="spantext"id="main4">{total/1000000} </span>
</h3><br/> 
<p class="tiny" id="main"></p>



<h3>
   <b>Fund CloseDate</b> <br/><span class="spantext"id="main5">{(new Date(clsdt*1000)).toLocaleString()} </span>
</h3><br/> 
<p class="tiny" id="main"></p>
</div>)
{/* } */}
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



export default Home;
