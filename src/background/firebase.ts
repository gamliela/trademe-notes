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

let collection = null;

async function signin() {
  const options = new OptionsModel();
  await options.load();

  firebase.initializeApp({
    apiKey: options.apiKey,
    projectId: options.projectId
  });
  collection = firebase.firestore().collection(options.collection);
  await firebase.auth().signInWithEmailAndPassword(options.username, options.password);
  console.log(`Successfully logged in with ${options.username}`);
}

function assertConnection() {
  if (!collection) {
    throw new Error("Firebase is not connected");
  }
}

async function getDocument<T>(id: string): Promise<T> {
  assertConnection();
  const doc = await collection.doc(id).get();
  return doc.data() as T;
}

function setDocument<T extends DocumentData>(id: string, data: T): Promise<void> {
  assertConnection();
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
