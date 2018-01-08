import React, { Component } from "react";
import { Nav, Navbar, NavItem, NavbarBrand, NavLink } from "reactstrap";

class GNavbar extends Component {
  render() {
    return (
      <Navbar color="primary" light expand="md">
        <NavbarBrand>
          Hello world
        </NavbarBrand>
        <Nav>
          <NavItem>
            <NavLink href="http://baidu.com">baidu</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default GNavbar;