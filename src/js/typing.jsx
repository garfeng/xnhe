import React, { Component } from "react";
import Dict from "./directory/pinyin";
import {XiaoHe} from "./directory/sp";
import {Button} from "reactstrap";

class CurrentGrade extends Component {
  render() {
    return <span>current grade</span>
  }
}

class OneCharacter extends Component{
  constructor(props){
    super(props);
  }

  render(){
    const c = this.props.c;
    let status = 0;
    if (typeof c.status != "undefined") {
      status = c.status;
    }
    let className = "";
    if(status == 1){
      className = "text-success";
    } else if(status == 2) {
      className = "text-error";
    }
   
   if(this.props.current){
      className += " current-chatacter";
   }

    return (
      <div className={"one-character "+className}>
        <span style={{fontSize:"2rem"}}>
          {c.zi}
        </span>
        <hr style={{marginTop:"0rem",marginBottom:"0.1rem"}}/>
        <span style={{fontSize:"0.5rem"}}>
          {c.sp}
        </span>
      </div>);
  }
}

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: [],
      currentIndex:0
    };
    this.dict = {};
    this.dictAll = {};
    this.parseDict();
    this.update();

    this.OneCharacter = this.OneCharacter.bind(this);
    this.randid = 0;
  }
  text() {
    return "你好，世界";
  }

  parseDict() {
    for (let i in Dict) {
      const str = Dict[i];
      for (let j = 0; j < str.length; j++) {
        const element = str[j];
        if(typeof this.dict[element] == "undefined"){
            this.dict[element] = i;
            //this.dictAll[element] = [];
        }
        //this.dictAll[element].push(i);
      }
    }
   /*
    let num = 0;
   for(let i in this.dictAll){
    if (this.dictAll[i].length>1) {
      console.log(i,":",this.dictAll[i]);
      num ++;
    }
   }
  console.log(num);
  */
  }

  pinyinOne(one) {
    return this.dict[one];
  }

  sp(py){
    const sp_directory = this.props.sp || "xiaohe";
    if(sp_directory == "xiaohe"){
       return XiaoHe[py];
    }
  }

  update() {
    const text = this.text();
    this.state.text = [];
    let index = 0;

    for (let i = 0; i < text.length; i++) {
      const element = text[i];
      const py = this.dict[element];
      const sp = this.sp(py);
      if (typeof py != "undefined" && py != null) {
        this.state.text.push({zi:element, py:py, sp:sp,index:index});
        index ++;
      }
    }
  }

  randId(){
    this.randid ++;
    return "rand_"+this.randid;
  }

  OneCharacter(c){
    return <OneCharacter key={this.randId()} c={c} current={this.state.currentIndex == c.index} />
  }

  onInput(e){
    console.log(e);
  }

  render() {
    return <div className="flex">
      {this.state.text.map(this.OneCharacter)}
    </div>
  }
}

class Keyboard extends Component {
  constructor(props){
    super(props);
    this.onInput = this.onInput.bind(this);
  }

  onInput(e){
    this.props.onInput(e);
  }

  render() {
    return <div>
      <input onKeyUp={this.onInput}/>
    </div>
  }
}

class Typing extends Component {
  constructor(props){
    super(props);
    this.onInput = this.onInput.bind(this);
  }

  onInput(e){
    this.refs["text"].onInput(e);
  }

  render() {
    return (
      <div>
        <CurrentGrade />
        <hr />
        <Text ref="text" />
        <hr />
        <Keyboard onInput={this.onInput} />
      </div>
    );
  }
}

export default Typing;