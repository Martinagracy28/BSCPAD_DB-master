import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*const firebaseConfig = {
    apiKey: "AIzaSyCYiv3QpHUx9LrGGwltRnuLBf6YfvJT4Oc",
    authDomain: "react-bsc-86577.firebaseapp.com",
    projectId: "react-bsc-86577",
    storageBucket: "react-bsc-86577.appspot.com",
    messagingSenderId: "387531336164",
    appId: "1:387531336164:web:b5f1bf37a9493b70adbff1",
    measurementId: "G-C7NGE0R5EZ
  };*/
// const firebaseConfig = {
//   apiKey: "AIzaSyAPqq2SL1Jf9ojbpQilxMTPqrm8cZwJhag",
//   authDomain: "react-bsc.firebaseapp.com",
//   databaseURL: "https://react-bsc-default-rtdb.firebaseio.com",
//   projectId: "react-bsc",
//   storageBucket: "react-bsc.appspot.com",
//   messagingSenderId: "352731249469",
//   appId: "1:352731249469:web:7a8488c5131ce63810e354",
//   measurementId: "G-E8VMVL5XV1"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDA509TVUejBXzNF547uSnkYBkst0EcxNw",
  authDomain: "sample-28.firebaseapp.com",
  databaseURL: "https://sample-28-default-rtdb.firebaseio.com",
  projectId: "sample-28",
  storageBucket: "sample-28.appspot.com",
  messagingSenderId: "1056023771485",
  appId: "1:1056023771485:web:0e82e17c3cedb7d31e50b4",
  measurementId: "G-S9NC3L1CHM"
};

var fireDB = firebase.initializeApp(firebaseConfig);
export default fireDB;