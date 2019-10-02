import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {OptionsModel} from "../shared_modules/OptionsModel";

const firebaseConfig = {
  apiKey: "AIzaSyA-N9oYjNxeoei2hJ2kq5HHKDhyGWqCZcY",
  authDomain: "trademe-notes.firebaseapp.com",
  databaseURL: "https://trademe-notes.firebaseio.com",
  projectId: "trademe-notes",
  storageBucket: "trademe-notes.appspot.com",
  messagingSenderId: "1032199106234",
  appId: "1:1032199106234:web:14bca7151d534fa5765c83"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Sign in
async function signin() {
  const options = new OptionsModel();
  await options.load();
  await firebase.auth().signInWithEmailAndPassword(options.username, options.password);
  console.log(`Successfully logged in with ${options.username}`);
}

signin().catch(error => console.log(error));
