const GET_DOC_REQUEST = "get_doc";
const SET_DOC_REQUEST = "set_doc";

type AnyRequestType = typeof GET_DOC_REQUEST | typeof SET_DOC_REQUEST;

type Request<RequestType, T> = {
  msg: RequestType,
  data: T
}

type AnyRequest = Request<AnyRequestType, any>;

const OK_RESPONSE = "ok";
const ERROR_RESPONSE = "error";

type AnyResponseType = typeof OK_RESPONSE | typeof ERROR_RESPONSE;

type Response<ResponseType, T> = {
  msg: ResponseType,
  data: T
}

type AnyResponse = Response<AnyResponseType, any>;

async function sendMessage<T, U>(msg: AnyRequestType, data: T): Promise<U> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({msg, data}, (response: AnyResponse) => {
      if (chrome.runtime.lastError)
        reject(chrome.runtime.lastError);
      else if (response.msg == OK_RESPONSE)
        resolve(response.data);
      else
        reject(response.data);
    });
  });
}

export {
  AnyRequestType,
  GET_DOC_REQUEST,
  SET_DOC_REQUEST,
  AnyRequest,
  AnyResponse,
  OK_RESPONSE,
  ERROR_RESPONSE,
  sendMessage
};
