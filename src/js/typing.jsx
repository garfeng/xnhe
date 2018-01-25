import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, FormText } from "reactstrap";
import words from './words';
import db from './storage';

class OneCharacter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const c = this.props.c;
    let className = "";

    if (c.ok == null) {
      className = "text-muted";
    } else {
      className = c.ok ? "text-primary" : "text-secondary";
    }

    if (this.props.current) {
      className += " current-chatacter";
    }

    return (
      <div className={"one-character " + className}>
        <span style={{ fontSize: "1rem" }}>
          {c.c}
        </span>
      </div>);
  }
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: [],
      currentIndex: 0
    };

    this.saveGrade = this.saveGrade.bind(this);
    this.OneCharacter = this.OneCharacter.bind(this);
    this.onInput = this.onInput.bind(this);
    this.grade = {
      errorNumber: 0,
      length: 0
    };
    this.wordsSelect = db.getItem("wordsSelect") || "";
    this.currentIndexInArticle = 0;
    this.update();
  }
  updateWordsSelect() {
    let len = Math.max(this.wordsSelect.length + 1, 5);
    len = Math.min(len, words.length);
    this.wordsSelect = words.substr(0, len + 1);
    db.setItem("wordsSelect", this.wordsSelect);
  }
  selectFromWords() {
    let res = "";
    let wdLen = this.wordsSelect.length || 1;
    const num = this.props.wdLen || 10;

    for (let i = 0; i < num; i++) {
      const index = parseInt((Math.random() * 100)) % wdLen;
      res = res + this.wordsSelect[index];
    }
    return res;
  }
  selectFromArticle() {
    const num = this.props.wdLen || 10;
    let selectNum = 0;
    let res = "";
    let findNum = 0
    while (selectNum < num && findNum < this.props.article.length) {
      findNum++;
      this.currentIndexInArticle++;
      if (this.currentIndexInArticle >= this.props.article.length) {
        this.currentIndexInArticle = 0;
      }
      const c = this.props.article[this.currentIndexInArticle];
      if (this.wordsSelect.indexOf(c) >= 0) {
        res = res + c;
        selectNum++;
      }
    }
    if (findNum >= this.props.article.length) {
      return this.selectFromWords();
    }

    return res;
  }
  selectArticle() {
    if (!this.props.article) {
      return this.selectFromWords();
    }
    return this.selectFromArticle();
    //    return this.selectFromArticle();
  }
  text() {
    if (this.props.currentGrade >= this.props.goalSpeed || this.wordsSelect.length < 5) {
      this.updateWordsSelect();
    }
    return this.selectArticle();
  }

  saveGrade() {

  }

  update() {
    const text = this.text();
    this.state.text = [];
    let index = 0;

    for (let i = 0; i < text.length; i++) {
      const element = text[i];
      this.state.text.push({ c: element, index: index, ok: null });
      index++;
    }
    this.state.currentIndex = 0;
    Object.assign(this.grade, { errorNumber: 0, length: text.length });
  }

  OneCharacter(c) {
    return <OneCharacter key={`index_${c.index}`} c={c} current={this.state.currentIndex == c.index} />
  }

  onInput(code) {
    const count = Math.min(code.length, this.state.text.length);
    let text = Object.assign([], this.state.text);
    let allOk = true;

    for (let i = 0; i < count; i++) {
      const c = this.state.text[i].c;
      const zi = {
        c: c,
        ok: c == code[i],
        index: i
      };
      allOk = allOk && zi.ok;
      if (!zi.ok) {
        this.grade.errorNumber += 1;
      }

      text[i] = zi;
    }
    if (code.length == this.state.text.length && allOk) {
      this.props.onReset(this.grade);
      this.update();
      return;
    }
    this.setState({ text: text, currentIndex: count });
  }

  render() {
    const helpInfo = this.props.article ? "从文章中选择以下文字：" : "随机选择以下文字：";
    return <Card>
      <CardHeader>文本</CardHeader>
      <CardBody>
        <div className="flex">
          {this.state.text.map(this.OneCharacter)}
        </div>
        <hr />
        <FormText color="muted">
          {helpInfo} {this.wordsSelect}
        </FormText>
      </CardBody>
    </Card>
  }
}

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.reset = this.reset.bind(this);

    this.state = { value: "" };
    this.start = false;
  }

  onKeyDown(e) {
    if (!this.start) {
      this.start = true;
      this.props.onStart();
    }
    this.props.onKeyDown();
  }

  onChange(e) {
    this.setState({ value: e.target.value })
    let v = e.target.value;
    v = v.replace(/[a-z|\ ]+/ig, "");
    this.props.onInput(v);
  }

  reset() {
    this.start = false;
    this.setState({ value: "" })
  }

  render() {
    return <Card>
      <textarea className="form-control" style={{
        width: "100%", height: "200px", minWidth: "100%", minHeight: "200px", maxWidth: "100%"
      }} onKeyDown={this.onKeyDown} onChange={this.onChange} value={this.state.value} ref="input" />
    </Card>
  }
}

class Typing extends Component {
  constructor(props) {
    super(props);
    this.onInput = this.onInput.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onReset = this.onReset.bind(this);
    this.updateGrade = this.updateGrade.bind(this);

    this.state = {
      currentGrade: 0,
      goalSpeed: parseInt(db.getItem("goalSpeed")) || 1,
      wdLen: parseInt(db.getItem("currentLen")) || 10,
      article: db.getItem("article") || ""
    }
  }

  onInput(e) {
    this.refs["text"].onInput(e);
  }

  onStart() {
    this.refs.grade.onStart();
  }

  onKeyDown() {
    this.refs.grade.onKeyDown();
  }

  onReset(grade) {
    this.refs.input.reset();
    this.refs.grade.onEnd(grade);
  }

  updateGrade(grade) {
    this.setState({ currentGrade: grade });
  }

  updateConfig() {
    this.onReset();
    this.refs.text.update();
  }

  render() {
    return (
      <div className="flex-center">
        <Text currentGrade={this.state.currentGrade} goalSpeed={this.state.goalSpeed || 2} article={this.state.article} wdLen={this.state.wdLen} ref="text" onReset={this.onReset} />
        <br />
        <Keyboard ref="input" onInput={this.onInput} onStart={this.onStart} onKeyDown={this.onKeyDown} />
        <br />
        <CurrentGrade ref="grade" goalSpeed={this.props.goalSpeed || 2} onGradeUpdate={this.updateGrade} />
      </div>
    );
  }
}

class CurrentGrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: parseFloat(db.getItem("speed") || "0"),
      error: parseFloat(db.getItem("error") || "0"),
      wordsSpeed: parseFloat(db.getItem("wordsSpeed") || "0")
    };
    this.currentGrade = {
      startTime: 0,
      endTime: 0,
      keyNum: 0,
      speed: 0
    }

    this.onStart = this.onStart.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.currentTime = this.currentTime.bind(this);
  }

  currentTime() {
    return new Date().getTime();
  }

  onStart() {
    this.currentGrade.startTime = this.currentTime();
  }

  onKeyDown() {
    const current = this.currentTime();
    const keyNum = this.currentGrade.keyNum + 1;
    const speed = keyNum * 1000 / (current - this.currentGrade.startTime);

    Object.assign(this.currentGrade, {
      endTime: current,
      keyNum: keyNum,
      speed: speed
    });

    this.props.onGradeUpdate(speed);
  }

  saveGradeList(data) {
    const str = db.getItem("history") || "[]";
    const saveData = Object.assign({ time: this.currentTime() }, data);
    let arr = JSON.parse(str) || [];
    arr.push(saveData);
    const output = JSON.stringify(arr);

    db.setItem("history", output);
  }

  onEnd(grade) {
    this.onKeyDown();
    const error = grade.errorNumber / grade.length;
    const current = this.currentTime();

    const data = {
      speed: this.currentGrade.speed,
      error: error,
      wordsSpeed: grade.length * 1000 * 60 / (current - this.currentGrade.startTime)
    };

    this.setState(data);

    db.setItem("speed", this.currentGrade.speed.toString());
    db.setItem("error", error.toString());
    db.setItem("wordsSpeed", data.wordsSpeed.toString());

    this.saveGradeList(data);

    Object.assign(this.currentGrade, {
      startTime: 0,
      endTime: 0,
      keyNum: 0
    });
  }

  render() {
    return <Card>
      <CardHeader>成绩</CardHeader>
      <CardBody className="flex">
        速度(击键)：{parseInt(this.state.speed * 100) / 100} {" | "}
        速度(字)：{parseInt(this.state.wordsSpeed * 100) / 100} {" | "}
        错误：{parseInt(this.state.error * 100)}%
      </CardBody>
    </Card>
  }
}

export default Typing;