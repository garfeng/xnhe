import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, Form, FormText, FormGroup, Label, Input, Button, CardBlock } from "reactstrap";
import db from './storage';

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
            goalSpeed: parseInt(db.getItem("goalSpeed")) || 1,
            currentLen: parseInt(db.getItem("currentLen")) || 10,
            article: db.getItem("article") || "",
            night: parseInt(db.getItem("night")) || 0,
            simple: parseInt(db.getItem("simple")) || 0
        }
        this.selectSpeed = this.selectSpeed.bind(this);
        this.selectLen = this.selectLen.bind(this);
        this.onInputArticle = this.onInputArticle.bind(this);
        this.triggerNight = this.triggerNight.bind(this);
        this.triggerMode = this.triggerMode.bind(this)
        this.modeMap = ["可爱", "日间", "夜间", "木板墙"];
        this.simpleMode = ["正常", "极简"];

    }

    triggerNight(d) {
        const index = Math.max(this.modeMap.indexOf(d), 0);
        this.setState({ night: index });
        db.setItem("night", index.toString());
        window.forceUpdate();
    }

    onInputArticle(e) {
        this.setState({ article: e.target.value });
        db.setItem("article", e.target.value);
    }

    selectLen(d) {
        this.setState({ currentLen: d });
        db.setItem("currentLen", d.toString())
    }

    selectSpeed(d) {
        if (this.state.goalSpeed < d) {
            db.setItem("wordsSelect", "");
        }
        this.setState({ goalSpeed: d });
        db.setItem("goalSpeed", d.toString());
    }

    triggerMode(d) {
        const index = Math.max(this.simpleMode.indexOf(d), 0);
        this.setState({ simple: index });
        db.setItem("simple", index.toString());
        window.forceUpdate();
    }

    render() {
        const speedMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const lenMap = [10, 20, 30, 50, 100, 200, 500];

        return (<Card>
            <CardHeader>设置</CardHeader>
            <CardBody>
                <Form>
                    <OneInputLine _id="goal_speed" name="目标击键">
                        {speedMap.map(d => <SelectButton onClick={this.selectSpeed} currentValue={this.state.goalSpeed} value={d} key={d} />)}
                        <FormText>
                            达到后，且正确率>70%，才会添加一个字继续练习。
                        </FormText>
                    </OneInputLine>
                    <OneInputLine _id="words_len" name="每段长度">
                        {lenMap.map(d => <SelectButton onClick={this.selectLen} currentValue={this.state.currentLen} value={d} key={d} />)}
                    </OneInputLine>
                    <OneInputLine _id="night" name="皮肤">
                        {this.modeMap.map(d => <SelectButton onClick={this.triggerNight} currentValue={this.modeMap[this.state.night]} value={d} key={d} />)}
                    </OneInputLine>
                    <OneInputLine _id="night" name="模式">
                        {this.simpleMode.map(d => <SelectButton onClick={this.triggerMode} currentValue={this.simpleMode[this.state.simple]} value={d} key={d} />)}
                        <FormText>手机用户可选择<strong>极简</strong>。</FormText>
                    </OneInputLine>
                </Form>
            </CardBody>
        </Card>)
    }
}


export default Config;