import React, { Component } from "react";
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, ListGroupItemHeading } from "reactstrap";
import { NavLink } from "react-router-dom";

class Right extends Component {
  render() {
    return (
      <div>
        <ListGroup color="primary">
          <NavLink exact to="/" activeClassName="active" className="list-group-item">打字</NavLink>
          <NavLink exact to="/grade" activeClassName="active" className="list-group-item">成绩</NavLink>
          <NavLink exact to="/config" activeClassName="active" className="list-group-item">设置</NavLink>
        </ListGroup>
      </div>
    );
  }
}

export default Right;