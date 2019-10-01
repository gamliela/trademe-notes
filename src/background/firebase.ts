import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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
const username = "";
const password = "";
firebase.auth().signInWithEmailAndPassword(username, password)
  .then(() => {
    console.error(`Successfully logged in with ${username}`);
  })
  .catch((error) => {
    console.error(`Can't login with ${username}`, error);
  });
