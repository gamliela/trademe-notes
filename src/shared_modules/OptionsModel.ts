import {observable} from "mobx";
import {storageGetKey, storageSetKey} from "./chrome_helper";

class OptionsModel {
  @observable username: string = "";
  @observable password: string = "";

  load() {
    return Promise.all([
      storageGetKey("username")
        .then((value: string) => {
          this.username = value
        })
        .catch(error => console.log(error)),
      storageGetKey("password")
        .then((value: string) => {
          this.password = value
        })
        .catch(error => console.log(error))
    ]);
  }

  save() {
    return Promise.all([
      storageSetKey("username", this.username).catch(error => console.log(error)),
      storageSetKey("password", this.password).catch(error => console.log(error))
    ]);
  }
}

export {OptionsModel};
