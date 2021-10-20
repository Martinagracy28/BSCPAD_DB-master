
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
    
 
  
  
 
    return (
      <div class=" text App" style={{backgroundColor:'black'}}>
       
       <br/>
       
       <h3 id="demo" class="time" style={{textAlign:"center"}}>
</h3>
        <h2 class="head"><b>CROWDFUNDING</b></h2>
        <br/>  <br/>
        <div class="container">
       
        <div class="row justify-content-center">

          <div class="col-4  align-self-center">
          <Card class="mt-2  shadow" style={{ width: '25rem' , padding: "30px",backgroundColor:"black",boxShadow:"0px 0px 15px pink"}}  >
          <h3>
 <b> APPID</b>  <br/> <span class="spantext"id="main1">{appid}</span>
</h3><p class="tiny" id="main5"></p>
<h3>
 <b> Fund Start Date</b>  <br/> <span class="spantext"id="main1">{(new Date(stardt*1000)).toLocaleString()}</span>
</h3><p class="tiny" id="main5"></p>
<p class="tiny"id="main6"></p>
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
<h3>
   <b>FundEndDate</b> <br/><span class="spantext"id="main3">{(new Date(enddt*1000)).toLocaleString()} </span>
</h3><br/> 
<p class="tiny" id="main"></p>
<h3>
   <b>Fund CloseDate</b> <br/><span class="spantext"id="main3">{(new Date(clsdt*1000)).toLocaleString()} </span>
</h3><br/> 
<p class="tiny" id="main"></p>
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
