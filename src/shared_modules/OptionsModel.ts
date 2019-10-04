import {observable, toJS} from "mobx";
import {storageGetKey, storageSetKey} from "./chrome_storage";

class OptionsModel {
  @observable username: string = "";
  @observable password: string = "";
  @observable apiKey: string = "";
  @observable projectId: string = "";
  @observable collection: string = "";

  async load() {
    await storageGetKey("options")
      .then((value) => {
        Object.assign(this, value)
      })
  }

  async save() {
    await storageSetKey("options", toJS(this))
  }
}

export {OptionsModel};
