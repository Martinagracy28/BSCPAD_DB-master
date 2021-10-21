/* global AlgoSigner */
import { signLogicSigTransactionObject } from 'algosdk';
import React from 'react';
import './App.css';
//Calling Bootstrap 4.5 css
import 'bootstrap/dist/css/bootstrap.min.css';
import fireDB from'./firebase';
//import { data } from 'jquery';
import { Card } from 'react-bootstrap';
import {BrowserRouter as Router , Route , Link , Switch} from "react-router-dom";

import { useEffect } from "react";
import { useState } from "react";
import app1 from "./app1.js";
import app2 from "./app2.js";

import { Button } from 'react-bootstrap';

global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');

function FourthPage(){
  
  const[appid,setappid]= useState("");
  const[appid2,setappid2]= useState("");
  const [accounts, setaccount] = useState("");
  let[stardt,setstartdt] = useState("");
  const[enddt,setenddt] = useState("");
  const[clsdt,setclsdt] = useState("");
  const[goal,setgoal] = useState("");
  const[total,settotal] = useState("");
  const[rec,setrec]= useState("");
  const[owner,setowner]= useState("");
  const[escrow,setescrow]= useState("");
  let[stardt2,setstartdt2] = useState("");
  const[enddt2,setenddt2] = useState("");
  const[clsdt2,setclsdt2] = useState("");
  const[goal2,setgoal2] = useState("");
  const[total2,settotal2] = useState("");
  const[rec2,setrec2]= useState("");
  const[owner2,setowner2]= useState("");
  const[escrow2,setescrow2]= useState("");
  const[st1,setst1]= useState([]);
  const[st2,setst2]=useState([]);

  let algodServer = "https://testnet-algorand.api.purestake.io/ps2";
  let algodToken = {
    'X-API-Key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl'
  };

  let algodPort = "";
  
  let client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
// async function readLocalState(client, account, index1, index2){
//   let accountInfoResponse = await client.accountInformation(account).do();
//   // let val = await client.ApplicationInformation(appId);
//   // console.log("val",val)
//   console.log("accinfo",accountInfoResponse);
 
//   for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) { 
//     if (accountInfoResponse['created-apps'][i].id == index1) {
//         console.log("Application's global state:");
//         for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
//             console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
//             let enc = accountInfoResponse['created-apps'][i]['params']['global-state'][n];
//             var decodedString = window.atob(enc.key);
//             // if(decodedString == "StartDate"){
//             //   setstartdt(enc.value.uint);
//             // }
//             // else if(decodedString == "EndDate"){
//             //   setenddt(enc.value.uint);
//             // }
//             // else if(decodedString == "FundCloseDate"){
//             //   setclsdt(enc.value.uint);
//             // }
//             if(decodedString == "Total"){
//               settotal(enc.value.uint);
//             }
//             else if(decodedString == "Goal"){
//               setgoal(enc.value.uint);
//             }
           
            
//             console.log("decoded",decodedString);
//         }
        
//     }
// }
// }
// async function readLocalState1(client, account, index1, index2){
//   let accountInfoResponse2 = await client.accountInformation(account).do();
//   // let val = await client.ApplicationInformation(appId);
//   // console.log("val",val)
//   console.log("accinfo",accountInfoResponse2);
//  for (let i = 0; i < accountInfoResponse2['created-apps'].length; i++) { 
//     if (accountInfoResponse2['created-apps'][i].id == index2) {
//         console.log("Application's global state:");
//         for (let n = 0; n < accountInfoResponse2['created-apps'][i]['params']['global-state'].length; n++) {
//             console.log(accountInfoResponse2['created-apps'][i]['params']['global-state'][n]);
//             let enc = accountInfoResponse2['created-apps'][i]['params']['global-state'][n];
//             var decodedString = window.atob(enc.key);
//             // if(decodedString == "StartDate"){
//             //   setstartdt2(enc.value.uint);
//             // }
//             // else if(decodedString == "EndDate"){
//             //   setenddt2(enc.value.uint);
//             // }
//             // else if(decodedString == "FundCloseDate"){
//             //   setclsdt2(enc.value.uint);
//             // }
//              if(decodedString == "Total"){
//               settotal2(enc.value.uint);
//             }
//             else if(decodedString == "Goal"){
//               setgoal2(enc.value.uint);
//             }
            
            
//             console.log("decoded",decodedString);
//         }
        
//     }
// }
// }
useEffect(() =>{first()},[st1,st2,clsdt,clsdt2,stardt,stardt2])
  const first = async () => {


  var firebase= fireDB.database().ref("Appid");
  console.log("firebase",firebase)
  firebase.child("39139636").once("value", function(snapshot) {
    console.log(snapshot.val());
    setst1(snapshot.val());
    
  }, function (error) {
    console.log("Error: " + error.code);
 });
 firebase.child("39142095").once("value", function(snapshot) {
  console.log(snapshot.val());
  setst2(snapshot.val());
  
}, function (error) {
  console.log("Error: " + error.code);
});
 


    var account = localStorage.getItem("wallet");
    console.log("wallet,",account)
    setaccount(account)
    setappid(39139636);
    setappid2(39142095);
    // read local state of application from user account
      // await readLocalState(client, account, appid ,appid2);
      // await readLocalState1(client, account, appid ,appid2);
  }
   
    
 
  return (
    <div className="" style={{backgroundColor:"white"}}> 
     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
    integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous"/>

    
      <div class="text-center">
      <h2 class="head1"><b>History</b></h2>
      </div>
      <div className="container">   
      
      <div className='row'> 
      
      {/* <div className='col-xl-12'>
       <h3 style={{color:"black"}}>  Upcoming pools</h3><br></br> 
      <Card class="mt-2  shadow" style={{ width: '25rem' , padding: "30px",backgroundColor:" #f2f2f2",color:"black"}}  >
         <p id="demo1" style={{textAlign:"right" ,color:"orange"}}>Starts in</p>
      <p id="demo" style={{textAlign:"right" ,color:"orange"}}></p>
  <h4 id ="1name">

  </h4>
  <p>
    Total Supply:
  </p>
  <h4 id ="1ts"> </h4>
  <div class="row">
    <div class="col">
      <h6>Min.Allocation<br/>1</h6>
    </div>
    <div class="col">
      <h6>Max.Allocation<br/>5</h6>
    </div>
    <div class="col">
      <h6>Access<br/><h4>Slate</h4></h6>
    </div>
    
    <button onClick={()=>this.check()}>click</button>
  </div>

</Card>
<br></br> 
      </div> */}

<div className='col-xl-12'>
       <h3 style={{color:"black"}}>Featured Pools</h3><br></br> 
       
     
          <div className="card float-left bg-sky mt-2  shadow" style={{width: '25rem', marginRight: '2rem', marginBlockStart: '1rem', padding: "30px",backgroundColor:" #f2f2f2",color:"black"}} >
            <div className="card-body">
            {/* <p  style={{textAlign:"right", color:"red"}}>Closed:{(new Date(clsdt*1000)).toLocaleString()}</p> */}
             <p  style={{textAlign:"right", color:"red"}}>Closed</p>
            
              <h4>APPID</h4>
              <p>{ appid}</p>
              <h4>Goal</h4>
              <p>  { st1.goal/1000000 }</p>
              {/* <h4>Fund start Date</h4> */}
              {/* <p>  {(new Date(stardt*1000)).toLocaleString() }</p> */}
              <progress id="main7" value={st1.total} max={st1.goal} class="progress11"></progress>
  <div class="row">
  <div class="col-4">
    {(st1.total/st1.goal)*100}%
  </div>
  <div class="col-8">
   Total  Reached:{1000000/1000000} Algo<br/>
  </div>
</div>

<Link to="/view1" className="btn btn-primary">View</Link>

               
             
<Router>
          
        
      
  
          <Switch>
    <Route exact path='/view1' component={app1}/>
    
    </Switch>
    
  </Router>
    
              </div> 
          </div> 
          
      
      </div> 
      <br></br>
 <div className="card float-left bg-sky mt-3  shadow" style={{width: '25rem', marginRight: '2rem', marginBlockStart: '1rem', padding: "30px",backgroundColor:" #f2f2f2",color:"black"}} >
            <div className="card-body">
            {/* <p  style={{textAlign:"right", color:"red"}}>Closed:{(new Date(clsdt2*1000)).toLocaleString()}</p> */}
              <p  style={{textAlign:"right", color:"red"}}>Closed</p>
            
              <h4>APPID</h4>
              <p>{ appid2}</p>
              <h4>Goal</h4>
              <p>  { st2.total/1000000 }</p>
              {/* <h4>Fund start Date</h4>
              <p>  {(new Date(stardt2*1000)).toLocaleString() }</p> */}
              <progress id="main7" value={st2.total} max="1000000" class="progress11"></progress>
  <div class="row">
  <div class="col-4">
    {(st2.goal/1000000)*100}%
  </div>
  <div class="col-8">
   Total  Reached:{st2.total/1000000} Algo<br/>
  </div>
</div>
<Link to="/view2" className="btn btn-primary">View</Link>

               
             
<Router>
          
        
      
  
          <Switch>
    <Route exact path='/view2' component={app2}/>
    
    </Switch>
    
  </Router>
              </div> 
          </div> 
          
      
      </div> 

    </div> 
     </div>
    
    
  );

}
export default FourthPage;
  
  
  
  



 


