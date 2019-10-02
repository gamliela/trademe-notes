import {observable} from "mobx";

class PopupPageModel {
  @observable url: string;
  @observable tags;

  constructor() {
    this.resolveUrl();
  }

  resolveUrl() {
    this.url = null;
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
      this.url = tabs[0].url;
    });
  }
}

export default PopupPageModel;
