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
    this.model.load().catch(e => console.error(e));
  }

  render() {
    return (
      <div>
        <h1>Trademe Notes Options</h1>
        <form>
          <fieldset>
            <legend>Firebase Configuration</legend>
            <label htmlFor="username">Username:</label>
            <input id="username" value={this.model.username} onChange={(e) => this.model.username = e.target.value}/>
            <label htmlFor="password">Password:</label>
            <input id="password" value={this.model.password} onChange={(e) => this.model.password = e.target.value}
                   type="password"/>
            <label htmlFor="apiKey">API Key:</label>
            <input id="apiKey" value={this.model.apiKey} onChange={(e) => this.model.apiKey = e.target.value}/>
            <label htmlFor="projectId">Project ID:</label>
            <input id="projectId" value={this.model.projectId} onChange={(e) => this.model.projectId = e.target.value}/>
            <label htmlFor="collection">Collection:</label>
            <input id="collection" value={this.model.collection}
                   onChange={(e) => this.model.collection = e.target.value}/>
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
