import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import db from './storage';

import Navbar from "./navbar";

import Left from "./left";
import Right from "./right";

const simpleStyle = `.card-header {
              display: none;
            }
            .card-body {
              padding: 0.6rem;
            }
            .card {
              margin-bottom: 0.2rem;
            }
            .navbar-all {
              display: none;
            }
            hr {
              margin-top: 0.2rem;
              margin-bottom: 0.5rem;
            }`;
const commonStyle = `.navbar-simple{
             display: none;
             }
             .card{
              margin-bottom:1rem;
             }`;

const SimpleStyle = (props) => {
  if (props.simple) {
    return (<style>
      {simpleStyle}
    </style>);
  } else {
    return (<style>
      {commonStyle}
    </style>);
  }
}


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      night: parseInt(db.getItem("night")) || 0,
      simple: parseInt(db.getItem("simple")) || 0,
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
      night: parseInt(db.getItem("night")) || 0,
      simple: parseInt(db.getItem("simple")) || 0
    });
  }

  render() {
    return (
      <Router>
        <div>
          <link onLoad={this.show} href={this.styleMap[this.state.night]} rel="stylesheet" />
          <SimpleStyle simple={this.state.simple} />
          <Container className="height-100" fluid={true}>
            <Row className="height-100">
              <Col className="height-100" xs={12} sm={12} md={12} lg={{ size: 6, offset: 3 }}>
                <Navbar />
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