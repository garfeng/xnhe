import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import Navbar from "./navbar";

import Left from "./left";
import Right from "./right";


class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Container fluid={true}>
          <Navbar />
          <Row>
            <Col xs={12} sm={9}>left</Col>
            <Col xs={12} sm={3}>right</Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
registerServiceWorker();