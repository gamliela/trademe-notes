import {action, observable, runInAction} from "mobx";
import {storageGetKey, storageSetKey} from "../shared_modules/chrome_helper";

class OptionsModel {
  @observable username: string = "";
  @observable password: string = "";

  constructor() {
    storageGetKey("username")
      .then((value: string) => {
        this.username = value
      })
      .catch(error => console.log(error));
    storageGetKey("password")
      .then((value: string) => {
        this.password = value
      })
      .catch(error => console.log(error));
  }

  @action.bound
  save() {
    storageSetKey("username", this.username).catch(error => console.log(error));
    storageSetKey("password", this.password).catch(error => console.log(error));
  }
}

export {OptionsModel};
