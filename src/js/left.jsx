import React, { Component } from "react";
import Route from "react-router-dom/Route";
import Typing from "./typing";
import Grade from "./grade";
import Config from "./config";
import Help from "./help";

class Left extends Component {
  render() {
    return (
      <div className="height-100">
        <Route exact path="/" component={Typing} />
        <Route exact path="/grade" component={Grade} />
        <Route exact path="/config" component={Config} />
        <Route exact path="/help" component={Help} />
      </div>
    );
  }
}

export default Left;