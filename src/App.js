
/* global AlgoSigner */
import { signLogicSigTransactionObject } from 'algosdk';
//import React from 'react';
import React, { Component } from 'react';
import secondpage from './secondpage';
import './App.css';
import thirdpage from './thirdpage';
import { useEffect } from "react";
import { useState } from "react";
import app1 from "./app1";
import app2 from "./app2";

import web3 from './web3';
import tokencontract from './tokencontract';
import TESTToken from './TESTToken';
//import TEST from './TEST';
import {BrowserRouter as Router , Route , Link , Switch} from "react-router-dom";
import home from './home';
import { Navbar } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
//import Background1 from '../src/images/logo.png'
import fourthpage from './fourthpage';
global.TextEncoder = require("util").TextEncoder; 
const algosdk = require('algosdk');



function App(){
  const [accounts, setaccount] = useState("");
  const [isOpenbutton, setIsOpenbutton] = useState(true);
  const [isList, setisList] = useState([]);
  const [isClick, setClick] = useState();
  const [isOpenlist, setIsOpenlist] = useState(false);
  

// const connect = async()=>{
//   AlgoSigner.connect()
//   .then((d) => {
//     AlgoSigner.accounts({
//       ledger: 'TestNet'
//     })
//     .then(async (d) => {
//      let account = d[3].address;
//      setaccount(account);
//      localStorage.setItem("wallet",account)
//      document.getElementById("cc").style.visibility="hidden"
     
//     })
//     .catch((e) => {
//       console.error(e);
//     });
//   })
//   .catch((e) => {
//     console.error(e);
//   });
  
//   //window.location.reload();
//    }
const onChangeOption=async(e)=>{
  let a=await setClick(e)
  console.log("setClick = ", e);
  localStorage.setItem("wallet",e)
  setaccount(e);
  //setIsOpenbutton(true)
}
   const connect = () => {
    setIsOpenbutton(false)
    AlgoSigner.connect()
.then((d) => {
  AlgoSigner.accounts({
    ledger: 'TestNet'
  })
  .then((d) => {
    let accounts = d;
    //document.getElementById("listacc").innerHTML=isClick;
    setClick(accounts[0].address);
    console.log("listaccount",d)
    setisList(d)
    setIsOpenlist(true)
  })
  .catch((e) => {
    console.error(e);
  }); 
  
  
})
.catch((e) => {
  console.error(e);
});
  }
  
      
  
  
 

       

    
    return (
      <div class="bg-dark">
        
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
   integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous"/>

        <div>
        <Router>
          <Navbar className="bg">
          <Navbar.Brand href="#home">
      
        
        <Link class="navlink"  exact to="/">

  Home

</Link>
      
      <Link class="navlink"  exact to="/s">
Join Pool{' '}
            </Link>
            {/*<Link class="navlink"  exact to="/t">
History{' '}
            </Link>*/}
            <Link class="navlink"  exact to="/t1">
      History{' '}
            </Link>
    </Navbar.Brand>
    <Navbar.Collapse className="justify-content-end">
    {/* <Button  onClick={connect} id="cc" variant="flat" style={{ backgroundColor: "#fa3455", color: "white"}}> Connect Wallet</Button> */}

<Link exact to="/">
{/* <Button variant="flat" id="ccc" style={{ backgroundColor: "#fa3455", color: "white"}}> {accounts}</Button> */}
<div>

{isOpenbutton ? 
<>
  <button variant="flat"  style={{ backgroundColor: "#fa3455", color: "white"}} className = "button button2" onClick={()=>connect()} id="listacc">
                  Connect Wallet 
                </button>
                </> : <> 
                <br></br>
                <select className = "drop" name="select1" onClick={(e)=> onChangeOption(e.target.value)}>
    {isList.map(fbb =>    
      <option  style={{ backgroundColor: "#fa3455", color: "white"}} key={fbb.address} value={fbb.address} >{fbb.address}</option>
    )};
  </select>

                </>}
    </div>
<label class="mr-3 mt-2" style={{color:"white"}}>

</label>
 
</Link>


      </Navbar.Collapse>
      </Navbar>
          <Switch>
    <Route exact path='/' component={home}/>
    <Route exact path='/t' component={thirdpage}/> 
    <Route exact path='/t1' component={fourthpage}/>
      <Route  exact path='/s' component={secondpage}/>
      <Route  exact path='/view1' component={app1}/>
      <Route  exact path='/view2' component={app2}/>
    </Switch>
    
  </Router>
    
</div>
</div>
    );
  }



export default App;