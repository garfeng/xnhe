import React, { Component } from "react";
import Dict from "./directory/pinyin";

class CurrentGrade extends Component {
  render() {
    return <span>current grade</span>
  }
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: [],
      rightPinyin: [],
      text: []
    };
    this.dict = {};
    this.parseDict();
    this.update();
  }
  text() {
    return "你好";
  }

  parseDict() {
    for (let i in Dict) {
      const str = Dict[i];
      for (let j = 0; j < str.length; j++) {
        const element = str[j];
        this.dict[element] = i;
      }
    }
  }

  pinyin(text) {
    let result = [];
    for (let i = 0; i < text.length; i++) {
      const element = text[i];
      const p = this.dict[element];
      if (typeof p != "undefined" && p != null) {
        result.push(p);
      }
    }
    return result;
  }

  pinyinOne(one) {
    return this.dict[one];
  }

  update() {
    const text = this.text();
    this.inputState = [];
    this.state.text = [];
    this.state.rightPinyin = [];

    for (let i = 0; i < text.length; i++) {
      const element = text[i];
      const p = this.dict[element];
      if (typeof p != "undefined" && p != null) {
        this.state.text.push(element);
        this.state.rightPinyin.push(p);
      }
    }

    console.log(this.state);
  }

  render() {
    return <span>Text</span>
  }
}

class Keyboard extends Component {
  render() {
    return <span>Keyboard</span>
  }
}

class Typing extends Component {
  render() {
    return (
      <div>
        <CurrentGrade />
        <hr />
        <Text />
        <hr />
        <Keyboard />
      </div>
    );
  }
}

export default Typing;