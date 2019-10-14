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

async function signin() {
  const options = new OptionsModel();
  await options.load();

  firebase.initializeApp({
    apiKey: options.apiKey,
    projectId: options.projectId
  });
  const collection = firebase.firestore().collection(options.collection);
  await firebase.auth().signInWithEmailAndPassword(options.username, options.password);
  console.log(`Successfully logged in with ${options.username}`);
  return {collection};
}

const session = signin();

async function getDocument<T>(id: string): Promise<T> {
  const {collection} = await session;
  const doc = await collection.doc(id).get();
  return doc.data() as T;
}

async function setDocument<T extends DocumentData>(id: string, data: T): Promise<void> {
  const {collection} = await session;
  await collection.doc(id).set(data);
}

chrome.runtime.onMessage.addListener(
  function (request: AnyRequest, sender, sendResponse) {
    function asyncHandler(promise: Promise<any>) {
      promise
        .then((data) => {
          console.log("Message response ok", data);
          sendResponse({msg: OK_RESPONSE, data});
        })
        .catch((error) => {
          console.log("Message response error", error);
          sendResponse({msg: ERROR_RESPONSE, error});
        });
    }

    if (request.msg == GET_DOC_REQUEST) {
      console.log("Message GET_DOC_REQUEST", request.data);
      asyncHandler(getDocument(request.data));
      return true;
    } else if (request.msg == SET_DOC_REQUEST) {
      console.log("Message SET_DOC_REQUEST", request.data);
      asyncHandler(setDocument(request.data.id, request.data.data));
      return true;
    }
  });

export {signin, getDocument, setDocument};
