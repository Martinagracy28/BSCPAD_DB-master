
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

global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');

//import Background from '../src/images/aa.gif'
//import TEST from './TEST';
//import {BrowserRouter as Router , Route , Link , Switch , NavLink} from "react-router-dom";
//import Background2 from '../src/images/logo1.png'

function Home() {
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
  const[opt,setopt] = useState("");
  let appId = 39138100;



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
          // 
          setopt(false);
        console.log("wo")
      }
      else{
        setopt(true);
        console.log("wo1")
      }
  }
   accountInfoResponse = await client.accountInformation("USTLFIOCUYDTURGK5E3KL63HB3TEALMXUDXS73VKPE6DQMVXOOJDHRINHQ").do();
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


const first = async () => {
  
  var firebase= fireDB.database().ref("Appid");
  console.log("firebase",(firebase))

  firebase.child("39138100").once("value", function(snapshot) {
    console.log(snapshot.val());
    console.log("closed",snapshot.val().closed)
   setstartdt(snapshot.val().startdate);
   setclsdt(snapshot.val().enddate)
   
  }, function (error) {
    console.log("Error: " + error.code);
 });
 


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
    let index = appid;
     console.log("appid",appid);
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
       
        <div class="row justify-content-center" style={{backgroundColor:'black'}}>

          <div class="col-4  align-self-center" style={{backgroundColor:'black'}}>
          <Card class="mt-2  shadow" style={{ width: '25rem' ,height:'50rem', padding: "30px",backgroundColor:"black",boxShadow:"0px 0px 15px pink"}}  >
          <h3>
 <b> APPID</b>  <br/> <span class="spantext"id="main1">{appid}</span>
</h3><p class="tiny" id="main5"></p>

  <div style={{backgroundColor:'black'}}>
    { opt == true ?(<div style={{backgroundColor:'black'}}>
      <h3>Before Proceed ,optin first</h3>
      <button class="btn btn-primary" onClick={optin}>Optin</button>
      </div>):(<div>

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



export default Home;
