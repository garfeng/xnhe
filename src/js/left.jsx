import React, { Component } from "react";
import Route from "react-router-dom/Route";
import Typing from "./typing";
import Grade from "./grade";

class Left extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Typing} />
        <Route exact path="/grade" component={Grade} />
      </div>
    );
  }
}

export default Left;