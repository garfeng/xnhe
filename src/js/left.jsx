import React, { Component } from "react";
import Route from "react-router-dom/Route";
import Typing from "./typing";
import Grade from "./grade";
import Config from "./config";

class Left extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Typing} />
        <Route exact path="/grade" component={Grade} />
        <Route exact path="/config" component={Config} />
      </div>
    );
  }
}

export default Left;