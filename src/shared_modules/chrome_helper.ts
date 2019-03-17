type StorageData<T> = {
  [propName: string]: T;
}

async function storageGetKey<T>(key: string, defaultValue?: T): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (result: StorageData<T>) => {
      if (!chrome.runtime.lastError)
        resolve(result[key] || defaultValue);
      else
        reject(chrome.runtime.lastError);
    });
  });
}

async function storageSetKey<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({[key]: value}, () => {
      if (!chrome.runtime.lastError)
        resolve();
      else
        reject(chrome.runtime.lastError);
    });
  });
}

export {storageGetKey, storageSetKey};
