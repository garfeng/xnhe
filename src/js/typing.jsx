import React, { Component } from "react";
import Dict from "./directory/pinyin";
import {XiaoHe} from "./directory/sp";
import {Button,Card,CardBody} from "reactstrap";

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
    let className = "";

    if(c.ok.length == 0){
      className = "text-muted"
    } else if (c.ok.length == 1) {
      className = c.ok[0]?"text-info":"text-danger";
    } else {
      className = (c.ok[0] && c.ok[1]) ?"text-primary":"text-secondary";
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
      currentIndex:0,
      currentIndexOfAllSP:"",
      netShouldBe:"",
      allSP:[]
    };
    this.dict = {};
    this.dictAll = {};
    this.parseDict();
    this.update();

    this.saveGrade = this.saveGrade.bind(this);
    this.OneCharacter = this.OneCharacter.bind(this);
    this.onInput = this.onInput.bind(this);
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

  saveGrade(){
    
  }

  update() {
    const text = this.text();
    this.state.text = [];
    this.state.allSP = [];
    let index = 0;


    for (let i = 0; i < text.length; i++) {
      const element = text[i];
      const py = this.dict[element];
      const sp = this.sp(py);
      if (typeof py != "undefined" && py != null) {
        this.state.text.push({zi:element, py:py, sp:sp,index:index,ok:[]});
        index ++;
        this.state.allSP.push(sp[0]);
        this.state.allSP.push(sp[1]);
      }
    }

    this.state.currentIndex = 0;
    this.state.currentIndexOfAllSP = 0;
    this.state.netShouldBe = this.state.allSP[0];
    this.saveGrade();
  }

  randId(){
    this.randid ++;
    return "rand_"+this.randid;
  }

  OneCharacter(c){
    return <OneCharacter key={this.randId()} c={c} current={this.state.currentIndex == c.index} />
  }

  onInput(code){
    let zi = this.state.text[this.state.currentIndex];
    if (code == this.state.netShouldBe) {
      if( typeof this.state.text[this.state.currentIndex]["ok"][this.state.currentIndexOfAllSP & 1] == "undefined"){
        this.state.text[this.state.currentIndex]["ok"][this.state.currentIndexOfAllSP & 1] = true;
      }

      this.state.currentIndexOfAllSP ++;
      this.state.currentIndex = this.state.currentIndexOfAllSP >> 1;

      if(this.state.currentIndexOfAllSP == this.state.allSP.length){
        this.update();
      } else {
      this.state.netShouldBe = this.state.allSP[this.state.currentIndexOfAllSP];
      }

    } else {
       this.state.text[this.state.currentIndex]["ok"][this.state.currentIndexOfAllSP & 1] = false;
    }
    this.forceUpdate();
    console.log(this.state);
  }

  render() {
    return <div className="flex">
      {this.state.text.map(this.OneCharacter)}
    </div>
  }
}

class OneLine extends Component{
  constructor(props){
    super(props);
    this.state = {};
    this.One = this.One.bind(this);
  }

  One(code){
    let outline = true;
    if(typeof this.props.current[code] != "undefined"){
      outline = false;
    }
    let className;
    if(code != "_"){
      className = "key-button";
    } else {
      className = "key-space";
    }
    return <Button className={className} key={code}  outline={outline} color="secondary">{code} ch</Button>
  }
  
  render(){
    const data = this.props.codes.split("");

    return (<div className="key-line" style={this.props.style}>
      {data.map(this.One)}
    </div>);
  }
}

class Keyboard extends Component {
  constructor(props){
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.lines = ["QWERTYUIOP","_ASDFGHJKL_","__ZXCVBNM____"];
    this.state = {
      current:{}
    };
  }

  onKeyUp(e){
    let newCurrent = this.state;
    delete newCurrent[e.key.toUpperCase()];
    this.setState({current:newCurrent});
  }

  onKeyDown(e){
    let newCurrent = this.state.current;
    newCurrent[e.key.toUpperCase()] = true;
    this.setState({current:newCurrent});
    this.props.onInput(e.key.toUpperCase());
  }

  render() {
    return <Card outline className="keyboard" color="primary" style={{padding:"0.5rem"}}>
    <Card outline color="secondary">
    <CardBody>

        <OneLine codes={this.lines[0]}  current={this.state.current}/>
        <OneLine codes={this.lines[1]}  current={this.state.current}/>
        <OneLine codes={this.lines[2]}  current={this.state.current} />
        <input onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown}/>
    </CardBody>

    </Card>
    </Card>
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