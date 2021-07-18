import firebase from "firebase"
require("@firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyBbz19Ifyq76RKlolecCMF8FGXGbnmI2FU",
  authDomain: "barter-app-a77f8.firebaseapp.com",
  projectId: "barter-app-a77f8",
  storageBucket: "barter-app-a77f8.appspot.com",
  messagingSenderId: "823129677682",
  appId: "1:823129677682:web:d1054ed6f0981b9ba007eb"
};

if(!firebase.apps.length){
firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore()