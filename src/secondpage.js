/* global AlgoSigner */
import { signLogicSigTransactionObject } from 'algosdk';
import React, { Component } from 'react';

import { Modal, Button,InputGroup,FormControl } from "react-bootstrap";
import './App.css';
import web3 from './web3';
//import ReactDOM from "react-dom";
import BEP20Token from "./BEP20Token";
import {Card} from "react-bootstrap"
import tokencontract from './tokencontract';
import TESTToken from './TESTToken';
import TEST from './TEST';

import { useEffect } from "react";
import { useState } from "react";
//import $, { error, event, get } from 'jquery';
//import Web3 from 'web3';
//import Background from '../src/images/aa.gif'
//import Popup from 'reactjs-popup';
global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');






function SecondPage(){
  
  var [openm, setopenm] = useState("");
  var [closem, setclosem] = useState("");
  var[openModal,setopenModal] = useState("");
  var[closeModal,setcloseModal] = useState("");
  const[appid,setappid]= useState("");
  let appId = parseInt(localStorage.getItem("appId"));
  const [accounts, setaccount] = useState("");
  
 const[myamtgiven,setmyamtgiven] = useState("");
  let[stardt,setstartdt] = useState("");
  const[enddt,setenddt] = useState("");
  const[clsdt,setclsdt] = useState("");
  const[goal,setgoal] = useState("");
  const[total,settotal] = useState("");
  const[rec,setrec]= useState("");
  const[owner,setowner]= useState("");
  const[escrow,setescrow]= useState("");
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
  //let n;
  console.log("accinfo",accountInfoResponse);
  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      if (accountInfoResponse['apps-local-state'][i].id == index) {
          console.log("User's local state:");
          if(accountInfoResponse['apps-local-state'][i][`key-value`] == undefined){
             console.log("undefined");
            }
          else{
            for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
              let endc = (accountInfoResponse['apps-local-state'][i][`key-value`][n]);
              let val = endc.value.uint;  
              setmyamtgiven(val);
              console.log("local", accountInfoResponse['apps-local-state'][i][`key-value`][n]);
          }
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
    //const ooc = await TEST.methods.isSLATEOpen().call();
    openModal = () => setopenm( true );
    closeModal = () => setclosem( false );

    let account = localStorage.getItem("wallet");
    console.log("wallet,",account)
    setaccount(account)
    setappid(appId);
    let index_donate = 45158379;
    // read local state of application from user account
      await readLocalState(client, account, index_donate);

  }
  useEffect(() =>{first()},[accounts,appid])
 
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
      alert("optin Completed")
      } 
const popup1 = async()=>{
  var x = document.getElementById('myDIV');
  if (x.style.visibility === 'hidden') {
    x.style.visibility = 'visible';
  } else {
    x.style.visibility = 'hidden';
  }

}
    
    const donate =async (event) => {
      console.log("AppId =",appId.toString());
    var amt =  window.prompt("Enter the amount you want to donate"); 
    let amount = parseInt(amt);
    let index = parseInt(localStorage.getItem("appId"));
  // define sender
  let sender = accounts;
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
// get node suggested parameters
  let params = await client.getTransactionParams().do();
  // comment out the next two lines to use suggested fee
  params.fee = 1000;
  params.flatFee = true;

  let appArgs = [];
  appArgs.push(new Uint8Array(Buffer.from("donate")));
  console.log("(line:516) appArgs = ",appArgs)
  let recv_escrow = localStorage.getItem("escrow");
  // create unsigned transaction
  let transaction1 = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs)
  
  let transaction2 = algosdk.makePaymentTxnWithSuggestedParams(sender, recv_escrow, amount, undefined, undefined, params);  
  
  let txns = [transaction1, transaction2];
  let txgroup = algosdk.assignGroupID(txns);
  console.log("group = ", txgroup);

    let txn_b64_1 = transaction1.toByte();
    let txn_b64_2 = transaction2.toByte();

    //let signTx = [];

    // let signArr = AlgoSigner.signTxn([{txn: txn_b64_1}, {txn: txn_b64_2}]);
    let signArr = [txn_b64_1, txn_b64_2];
    let base64Txs = signArr.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));
console.log("line 1318");
    let signedTxs = await AlgoSigner.signTxn([
      {
        txn: base64Txs[0],
      },
      {
        txn: base64Txs[1],
      },
    ]);
  console.log("sign complete");
    let binarySignedTxs = signedTxs.map((tx) => AlgoSigner.encoding.base64ToMsgpack(tx.blob));
    let trans = await client.sendRawTransaction(binarySignedTxs).do();
    console.log("Send complete");
    console.log("txID", trans);
    console.log("id", trans.txId);
   await waitForConfirmation(client, trans.txId);
   alert("Donated Successfully");
   first();
  

    }

    
    
    return (
      <div class="text App"  style={{backgroundColor:'white'}}>
         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
   integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous"/>
 <br/>
 <p id="demo1" class="time"></p>
 <h3 id="demo" class="time" style={{textAlign:"center"}}>
</h3>
        <h1 class="head1"><b>
          Join Pool
          </b>

        </h1>
        <br/>
        <br/>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col">
              
 <Card  style={{ width: '100%' , padding: "25px" ,backgroundColor:"#f2f2f2", color:'black'}} >
        <p >

<span class="tt">APPID</span> <br/> 
</p><p id="main">{appid}</p>
<p id="dem" class="tiny">

</p>

<p><span class="tt">
Goal Amount</span> <br/> </p>
<p id="main1">{goal/1000000}</p>
{/* <p> */}
{/* <span class="tt">Amount Reached</span> <br/> </p><p id="main2"> {total/1000000}
</p> */}

      
        </Card>

            </div>
            <div class="col">
           
            < Card style={{backgroundColor:"#fa3455", width: '100%' , padding: "25px"}} class="card11" bodyStyle={{}} >

        
        <p>
        <span class="tt">  MyAmountGiven</span> <br/>  </p><p id="main6">{myamtgiven/1000000}
        </p>
        <br/>
        <p class="p">Progress</p>
        <progress id="main7" value={total} max={goal} class="progress11"></progress>
        <div>
          <div class="container" id="main8">
            <div class="row">
            <div class="col-2">
            <p class="perci">
          {(total/goal)*100}%
        </p>
            </div>
              <div class="col align-self-end maxi">
              <p>
              <h6>Amount Reached:{total/1000000}</h6>
                 </p>     </div>
            
            </div>
          </div>
        </div>
        <br/>
       

        </Card>

            </div>
          </div>
        </div>
        <br/>   <br/> 
    
          <div class="ma">
            <table>
              <div class="row">
                <div class="col-6 mt-3">
                {/* <button class="btn btn-primary" onClick={optin} id="ap">Optin</button> */}

                </div>
               

  
  <div class="col-2 mt-3" >
          {/* <Button variant="primary" id="ap1" onClick={openModal}>
Donate          </Button> */}
<button class="btn btn-primary" onClick={donate}>Donate</button>
        
        {/* <Modal class="pop4" show={openm} onHide={closeModal} centered>
          <Modal.Header className="myModal" closeButton>
            <Modal.Title><b>Enter amount...</b>.</Modal.Title>
          </Modal.Header>
          <Modal.Body className="myModal">
          <InputGroup className="mb-3">
    <InputGroup.Prepend>
    </InputGroup.Prepend>
    <div clas="row">
      <div class="col-sm">
      
      <FormControl className="myInput" aria-label="Amount (to the nearest dollar)"id="amount1"  />

      </div>
      <div class="col-sm">
        <p style={{color:"red"}} id="form"></p>
      </div>
    </div>
    <InputGroup.Append>
    <div class="row App">
      <div class="col">
        minimum amount is  1 <br/>
        maximum amount is 2
      </div>
    </div>
    </InputGroup.Append>
  </InputGroup>
          </Modal.Body>
          <Modal.Footer className="myModal">
           
           
             <Button variant="primary" onClick={donate}>
              Donate
            </Button>
          
           
            
          </Modal.Footer>
        </Modal>*/}
  </div> 

              </div>
            </table>
        </div>

      
<br/><br/>
     
       
      

  </div>
    );
 
}


export default SecondPage;
