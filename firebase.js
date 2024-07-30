// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc9OwKEApv6E1ZfFFpZ8RFUQ3-yXRHCPM",
  authDomain: "pantry-tracker-cb5b8.firebaseapp.com",
  projectId: "pantry-tracker-cb5b8",
  storageBucket: "pantry-tracker-cb5b8.appspot.com",
  messagingSenderId: "408740923843",
  appId: "1:408740923843:web:17aa16aab8c81e4d3d1576"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
export {app, firestore}