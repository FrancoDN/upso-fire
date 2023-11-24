    // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF0MOK4F_KfUlrOS-XUPwsAjCRoeVzfn4",
  authDomain: "upso-todolist.firebaseapp.com",
  projectId: "upso-todolist",
  storageBucket: "upso-todolist.appspot.com",
  messagingSenderId: "1002398211876",
  appId: "1:1002398211876:web:9913737aff1487d08d5db1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };