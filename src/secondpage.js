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
  let appId = 39138100;
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
  console.log("accinfo",accountInfoResponse);
  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      if (accountInfoResponse['apps-local-state'][i].id == index) {
          console.log("User's local state:");
          for (let n = 0; n < accountInfoResponse['apps-local-state'][i][`key-value`].length; n++) {
            var endc = (accountInfoResponse['apps-local-state'][i][`key-value`][n]);
            var val = endc.value.uint;  
            setmyamtgiven(val);
            console.log("local", accountInfoResponse['apps-local-state'][i][`key-value`][n]);
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

    var account = localStorage.getItem("wallet");
    console.log("wallet,",account)
    setaccount(account)
    setappid(appId);
    // read local state of application from user account
      await readLocalState(client, account, appId);
// //time function
// var countDownDate = new Date("jun 04, 2021 20:15:00").getTime();
// console.log("date",countDownDate);
// // Update the count down every 1 second
// var x = setInterval(function() {

//   // Get today's date and time
//   var now = new Date().getTime();
    
//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;
    
//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
//   // Output the result in an element with id="demo"
//   document.getElementById("demo").innerHTML = days + "d " + hours + "h "
//   + minutes + "m " + seconds + "s ";
    
//   // If the count down is over, write some text 
//   if(distance<0){
//     clearInterval(x);
//     document.getElementById("dem").innerHTML = "Yet to start" ;
    
//     document.getElementById("demo").style.visibility="hidden";
//     document.getElementById("demo1").style.visibility="hidden";
//     document.getElementById("ap").disabled = false;
//      document.getElementById("ap1").disabled=false;

    
//   }
 
 
 
//  else {
    
//    //  document.getElementById("dem").innerHTML = "closed";
//      document.getElementById("ap").disabled = true;
//      document.getElementById("ap1").disabled=true;
     
//      document.getElementById("demo").style.visibility="visible";


//   }

  
// }, 1000);




//   //  var x = document.getElementById('myDIV').style.visibility = "hidden";
//   var bigInt = require("big-integer");
//     var amount1;
    //  const accounts = await  web3.eth.getAccounts();
    // const balance = await web3.eth.getBalance(tokencontract.options.address);
    // const totalsupply = await tokencontract.methods.totalSupply().call();
    // const decimal = await TESTToken.methods.decimals().call();
    // const name = await TESTToken.methods.name().call();

    // var pro1= await BEP20Token.methods.balanceOf("0xA05726e61D59594444E54E390E1Dd7aF2f4d4Eb6").call();
    // const At = await TESTToken.methods.balanceOf("0x664F6Bf102eF9510F4114dd5321117599eFb2336").call();
    // const symbol = await TESTToken.methods.symbol().call();
    // const balance_BUSD = await BEP20Token.methods.balanceOf(accounts[0]).call();
    // const balance_TEST= await TESTToken.methods.balanceOf(accounts[0]).call();





    
// var busd=balance_BUSD/1000000000000000000;
// pro1=pro1/1000000000000000000;
// var  pro=pro1.toFixed(2);   
// var baltest=balance_TEST/1000000000;
// var availtk=At/1000000000;
     

//      var a = 5-availtk;
     
//      var a1=a/1000000000;
//      var p=a/5;
     
//      p=p*100;
//     var p1=p.toFixed(6);

    // if(5 === 5){
    //   document.getElementById("dem").innerHTML="Closed";
    //   document.getElementById("demo").style.visibility="hidden";
    //   document.getElementById("demo1").style.visibility="hidden";

    //   document.getElementById("ap").disabled=true;
    //   document.getElementById("ap1").disabled=true;
      


    // }
  
  
    //this.setState({totalsupply,balance,name,bigInt,symbol,decimal,balance_TEST,balance_BUSD,At,p1,a,a1,baltest,availtk,amount1,pro,busd});

    
  }
  useEffect(() =>{first()},[])
 
     
const optin = async (event) =>{
 

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

// optIn
async function optInApp(client, account, index) {
    // define sender
    let sender = account;
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
    // AlgoSigner.signTxn([{txn: txn_b64}])
  
    // .then(async (d) => {
    //   let signedTxs = d;
    //   // Submit the transaction
    //   console.log("sign", signedTxs[0].blob);
    // // await client.sendRawTransaction(signedTxs[0].blob).do();

    // AlgoSigner.send({
    //   ledger: 'TestNet',
    //   tx: signedTxs[0].blob
    // })
    // .then((d) => {
    //   txID = d;
    //   // document.getElementById("txid").innerHTML = "Transaction ID : " + JSON.stringify(txID);
    //   console.log(txID);
    // })
    // .catch((e) => {
    //   console.error(e);
    // });



    // // Wait for confirmation
    // await waitForConfirmation(client, txId);

    // // display results
    // let transactionResponse = await client.pendingTransactionInformation(txId).do();
    // console.log("Opted-in to app-id:",transactionResponse['txn']['txn']['apid'])
    // })
     
    //  .catch((e) => {
    //      console.error(e);
    //  });
}





async function main() {
    try {
    // initialize an algodClient
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    let appId = 39138100;
    // opt-in to application
    let accounts;
    AlgoSigner.connect()
    .then((d) => {
      AlgoSigner.accounts({
        ledger: 'TestNet'
      })
      .then(async (d) => {
        accounts = d;
      console.log("Address 1", d[0]);
        await optInApp(algodClient, d[1].address, appId);
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
const popup1 = async()=>{
  var x = document.getElementById('myDIV');
  if (x.style.visibility === 'hidden') {
    x.style.visibility = 'visible';
  } else {
    x.style.visibility = 'hidden';
  }

}
    
    const donate =async (event) => {
    var amt =  window.prompt("Enter the amount you want to donate"); 
    let amount = amt * 1000000;
    

  global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');


// user declared algod connection parameters
//purestake api used
let algodServer = "https://testnet-algorand.api.purestake.io/ps2";
let algodToken = {
    'X-API-Key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl'
   };

let algodPort = "";
// declare application state storage (immutable)
// let localInts = 1;
// let localBytes = 0;
// let globalInts = 5;
// let globalBytes = 3;



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



async function callApp(account, index, amount) {
  // define sender
  let sender = account;
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
// get node suggested parameters
  let params = await client.getTransactionParams().do();
  // comment out the next two lines to use suggested fee
  params.fee = 1000;
  params.flatFee = true;

  let appArgs = [];
  appArgs.push(new Uint8Array(Buffer.from("donate")));
  console.log("(line:516) appArgs = ",appArgs)

  // create unsigned transaction
  let transaction1 = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs)
  //  let txId1 = transaction1.txID().toString();

  // // Sign the transaction
  // let signedTxn = txn.signTxn(account.sk);
  // console.log("Signed transaction with txID: %s", txId);

  let transaction2 = algosdk.makePaymentTxnWithSuggestedParams(sender, "OUVJXNKNE5IKMESSMEFTR3PJ3E5PBTC2AGXA7VPSJNPIJL6IUCAF4LUF4Q", amount, undefined, undefined, params);  
  
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
  
}





async function main() {
    try {
    // initialize an algodClient
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // get accounts from mnemonic
    let creatorAccount = algosdk.mnemonicToSecretKey("bitter never rather carry picture firm rare gloom repeat truck volume surprise candy thumb parent side before popular turtle analyst similar vehicle gas absent public");
    let userAccount = algosdk.mnemonicToSecretKey("unique urban normal exchange shrimp inspire steel domain family cheap sea river input credit embark day organ dune try squeeze subject trial can about fault");
   
    // compile programs 
    // let approvalProgram = await compileProgram(algodClient, approvalProgramSourceInitial);
    // let clearProgram = await compileProgram(algodClient, clearProgramSource);

    // create new application
    //let appId = await createApp(algodClient, creatorAccount, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes);
    let appId = 39138100;
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
        await callApp(accounts[1].address, appId , amount);
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

//       event.preventDefault();
      
//       const accounts = await  web3.eth.getAccounts();
//       var amount=document.getElementById("amount1").value;
//       amount=amount*1000000;
//       amount=amount+"000000000000";
      
//      if(amount<=2000000000000000000 && amount>=1){ 
//       this.closeModal();
//       var v=0;
//      // document.getElementById("exe").style.visibility = "hidden";

//       v=v+amount;
//      // alert(amount);
     
//     // alert("Entered amount is "+amount/1000000000000000000);

// //alert(s)
//       await TEST.methods.click(amount).send(
//       {
//       from:accounts[0]
//       }
//      );
//      window.location.reload();
//     }
//     else if (amount>2000000000000000000){
//       document.getElementById("form").innerHTML="amount reaches maximum limit";

//     }
//     else{
//     document.getElementById("form").innerHTML="amount doesn't reaches minimum limit";
   

//     }
   
//     this.setState({v});

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
          {(total/1000000)*100}%
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
                <button class="btn btn-primary" onClick={optin} id="ap">Optin</button>

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
