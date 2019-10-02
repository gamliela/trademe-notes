import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import {OptionsModel} from "../shared_modules/OptionsModel";

@observer
class OptionsPage extends Component {
  model: OptionsModel;

  constructor(props) {
    super(props);
    this.model = new OptionsModel();
    this.model.load().catch(e => {
      throw e;
    });
  }

  updateUsername(e) {
    this.model.username = e.target.value;
  }

  updatePassword(e) {
    this.model.password = e.target.value;
  }

  render() {
    return (
      <div>
        <h1>Trademe Notes Options</h1>
        <form>
          <fieldset>
            <legend>Firebase Auth</legend>
            <label htmlFor="username">Username:</label>
            <input id="username" value={this.model.username} onChange={this.updateUsername.bind(this)}/>
            <label htmlFor="password">Password:</label>
            <input id="password" value={this.model.password} onChange={this.updatePassword.bind(this)}/>
          </fieldset>
          <p>
            <button type="button" onClick={this.model.save.bind(this.model)}>Save</button>
          </p>
        </form>
      </div>
    );
  }
}

export default OptionsPage;
