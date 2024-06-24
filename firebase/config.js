import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6GZBcGGRSMjlRD9jc8-Om6pmQjCPozd4",
  authDomain: "sesy-food-point.firebaseapp.com",
  projectId: "sesy-food-point",
  storageBucket: "sesy-food-point.appspot.com",
  messagingSenderId: "977472947704",
  appId: "1:977472947704:web:13e72bdb290b9fbdb5420d",
  measurementId: "G-KXHECSLSN4"
};



const app = initializeApp(firebaseConfig);
export const fireStore = getFirestore(app);
export const auth = getAuth(app);