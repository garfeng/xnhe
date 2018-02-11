import React, { Component } from "react";
import { Col, Nav, Navbar, NavItem, NavbarBrand, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import { NavLink } from "react-router-dom";

class Help extends Component {

  render() {
    return (<Card className="full">
      <CardHeader>关于</CardHeader>
      <CardBody className="full">
        <h4>一些你可能不会注意到的细节</h4>
        <hr />
        <ul>
          <li>本工具运行时无需联网，所有数据都存储在你的本地。加载完毕后，您可以在地铁等没有信号的位置继续练习，数据不会丢失。</li>
          <li>每次提高<strong>目标击键</strong>后，已练习的字会被<strong>重置</strong>，请谨慎操作。</li>
          <li>多余的空格和字母，在判断正误时会忽略。</li>
          <li>请把嵌入模式设为「编码」或「空白」，不要设为「首选」，否则二码及二码以上的字都会被判断错误。</li>
        </ul>
      </CardBody>
    </Card>);
  }
}

export default Help;