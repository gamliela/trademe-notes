import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import DocumentData = firebase.firestore.DocumentData;
import {OptionsModel} from "../shared_modules/OptionsModel";

// TODO: move to OptionsModel
const firebaseConfig = {
  apiKey: "AIzaSyA-N9oYjNxeoei2hJ2kq5HHKDhyGWqCZcY",
  authDomain: "trademe-notes.firebaseapp.com",
  databaseURL: "https://trademe-notes.firebaseio.com",
  projectId: "trademe-notes",
  storageBucket: "trademe-notes.appspot.com",
  messagingSenderId: "1032199106234",
  appId: "1:1032199106234:web:14bca7151d534fa5765c83"
};

// TODO: move to OptionsModel
const COLLECTION = "properties";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const collection = firebase.firestore().collection(COLLECTION);

async function signin() {
  const options = new OptionsModel();
  await options.load();
  await firebase.auth().signInWithEmailAndPassword(options.username, options.password);
  console.log(`Successfully logged in with ${options.username}`);
}

async function getDocument<T>(id: string): Promise<T> {
  const doc = await collection.doc(id).get();
  return doc.data() as T;
}

function setDocument<T extends DocumentData>(id: string, data: T): Promise<void> {
  return collection.doc(id).set(data);
}

export {signin, getDocument, setDocument};
