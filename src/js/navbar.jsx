import React, { Component } from "react";
import { Nav, Navbar, NavItem, NavbarBrand } from "reactstrap";
import { NavLink } from "react-router-dom";

class GNavbar extends Component {
  render() {
    return (
      <Navbar color="primary" dark expand="md">
        <NavLink className="navbar-brand" activeClassName="active" to="/">
          Home
          </NavLink>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink className="nav-link" activeClassName="active" to="/grade">Grade</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default GNavbar;