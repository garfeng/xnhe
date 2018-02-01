import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import db from './storage';

import Navbar from "./navbar";

import Left from "./left";
import Right from "./right";


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      night: parseInt(db.getItem("night")) || 0,
      display: "none"
    };
    this.updateMode = this.updateMode.bind(this);

    this.styleMap = [
      "https://cdn.bootcss.com/bootswatch/4.0.0/minty/bootstrap.min.css",
      "https://cdn.bootcss.com/bootswatch/4.0.0/flatly/bootstrap.min.css",
      "https://cdn.bootcss.com/bootswatch/4.0.0/darkly/bootstrap.min.css",
      "https://cdn.bootcss.com/bootswatch/4.0.0/sketchy/bootstrap.min.css"
    ];
    //window.onload = this.show;
  }

  updateMode() {
    this.setState({
      night: parseInt(db.getItem("night")) || 0
    });
  }



  render() {
    return (
      <Router>
        <div>
          <link onLoad={this.show} href={this.styleMap[this.state.night]} rel="stylesheet" />
          <Navbar />
          <Container className="height-100" fluid={true}>
            <Row className="height-100">
              <Col className="height-100" xs={12} sm={12} md={12} lg={{ size: 6, offset: 3 }}>
                <Left />
              </Col>
              <Col xs={12} sm={12} md={12} lg={3}>
                <Right />
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}

const reactRootId = ReactDOM.render(<Index />, document.getElementById('root'));

window.forceUpdate = () => {
  reactRootId.updateMode();
}

/*
import registerServiceWorker from './registerServiceWorker';
registerServiceWorker();
*/