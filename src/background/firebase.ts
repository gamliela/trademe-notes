import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import DocumentData = firebase.firestore.DocumentData;
import {OptionsModel} from "../shared_modules/OptionsModel";
import {
  AnyRequest,
  ERROR_RESPONSE,
  GET_DOC_REQUEST,
  OK_RESPONSE,
  SET_DOC_REQUEST
} from "../shared_modules/chrome_messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA-N9oYjNxeoei2hJ2kq5HHKDhyGWqCZcY",
  projectId: "trademe-notes",
};

const COLLECTION = "properties";

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

chrome.runtime.onMessage.addListener(
  function (request: AnyRequest, sender, sendResponse) {
    function asyncHandler(promise: Promise<any>) {
      promise
        .then((data) => {
          sendResponse({msg: OK_RESPONSE, data});
        })
        .catch((error) => {
          sendResponse({msg: ERROR_RESPONSE, error});
        });
    }

    if (request.msg == GET_DOC_REQUEST) {
      asyncHandler(getDocument(request.data));
      return true;
    } else if (request.msg == SET_DOC_REQUEST) {
      asyncHandler(setDocument(request.data.id, request.data.data));
      return true;
    }
  });

export {signin, getDocument, setDocument};
