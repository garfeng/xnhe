import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, CardBlock } from "reactstrap";

class SelectButton extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.value);
  }
  render() {
    return (<Button size="sm" style={{ marginRight: "1px", marginBottom: "1px" }} color="primary" outline={this.props.currentValue != this.props.value} onClick={this.onClick}>{this.props.value}</Button>);
  }
}

class OneInputLine extends Component {
  render() {
    return <FormGroup>
      <Row>
        <Label xs={12} sm={6} md={4} lg={4} for={this.props._id}>{this.props.name}</Label>
        <Col xs={12} sm={6} md={8} lg={8}>
          {this.props.children}
        </Col>
      </Row>
    </FormGroup >
  }
}

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSpeed: 1,
      currentLen: 10,
      article: "",
    }
    this.selectSpeed = this.selectSpeed.bind(this);
    this.selectLen = this.selectLen.bind(this);
    this.onInputArticle = this.onInputArticle.bind(this);
  }

  onInputArticle(e) {
    this.setState({ article: e.target.value });
  }

  selectLen(d) {
    this.setState({ currentLen: d });
  }

  selectSpeed(d) {
    this.setState({ currentSpeed: d });
  }

  render() {
    const speedMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const lenMap = [10, 20, 30, 50, 100, 200, 500];

    return (<Card outline color="primary">
      <CardHeader>设置</CardHeader>
      <CardBody>
        <Form>
          <OneInputLine _id="goal_speed" name="目标速度">
            {speedMap.map(d => <SelectButton onClick={this.selectSpeed} currentValue={this.state.currentSpeed} value={d} key={d} />)}
          </OneInputLine>
          <OneInputLine _id="words_len" name="每段长度">
            {lenMap.map(d => <SelectButton onClick={this.selectLen} currentValue={this.state.currentLen} value={d} key={d} />)}
          </OneInputLine>
          <OneInputLine _id="article" name="文本">
            <Input type="textarea" id="article" value={this.state.article} onChange={this.onInputArticle} />
          </OneInputLine>
        </Form>
      </CardBody>
    </Card>)
  }
}


export default Config;