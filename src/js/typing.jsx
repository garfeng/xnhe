import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, FormText, UncontrolledTooltip, Input } from "reactstrap";
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
            className = c.ok ? "text-success" : "text-danger";
        }

        if (this.props.current) {
            className += " current-chatacter";
        }

        return (
            <div className={"one-character " + className}>
                <span >
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
        this.OneProbC = this.OneProbC.bind(this);
        this.grade = {
            errorNumber: 0,
            length: 0
        };
        this.wordsSelect = db.getItem("wordsSelect") || "";

        this.everyWordsProb = JSON.parse(db.getItem("wordsProbs") || "{}") || {};

        this.updateOldDataToNew();

        this.everyWordsCount = {};
        this.everyWordsError = [];

        this.currentIndexInArticle = 0;

        this.wordsSelectRandom = this.wordsSelect;

        this.allInfo = JSON.parse(db.getItem("all_info")) || {
            number: 0,
            time: 0,
            days: {}
        };

        this.updateProb();
        this.update();
    }

    updateOldDataToNew() {
        for (let i in this.everyWordsProb) {
            if (typeof this.everyWordsProb[i] != "number") {
                this.everyWordsProb[i] = this.everyWordsProb[i][0] / (this.everyWordsProb[i][1] + 1);
            }
        }
    }

    updateProb() {
        let obj = {}
        const text = this.wordsSelect.split("");
        text.map(d => obj[d] = 0.5);
        Object.assign(obj, this.everyWordsProb);
        this.everyWordsProb = obj;
        db.setItem("wordsProbs", JSON.stringify(obj));
        //this.wordsSelectRandom = "";

        if (text.length > 0) {
            this.wordsSelectRandom += text[text.length - 1] + text[text.length - 1];
        }

        /*
        for (const index in text) {
            const key = text[index];
            const needNum = Math.max(1, text.indexOf(key) + 6 - text.length);

            this.everyWordsCount[key] = 10 - needNum;

            for (let i = 0; i < needNum; i++) {
                this.wordsSelectRandom += key;
            }
        }
        */
    }

    updateWordsSelect() {
        let len = Math.max(this.wordsSelect.length + 1, 5);
        len = Math.min(len, words.length);
        this.wordsSelect = words.substr(0, len);
        if (len <= 10) {
            this.wordsSelectRandom += this.wordsSelect;
        }
        db.setItem("wordsSelect", this.wordsSelect);
        console.log("updateWordsSelect")
        this.updateProb();
    }

    isWordOk(c) {
        const dCount = this.everyWordsCount[c] || 0;
        const prob = this.everyWordsProb[c] || 0.5;
        return prob >= 0.7 && dCount >= 2;
    }

    selectFromWords() {
        let res = "";
        let wdLen = this.wordsSelectRandom.length || 1;
        const num = this.props.wdLen || 10;
        let i = 0;

        console.log(this.wordsSelectRandom);

        while (i < num) {
            const index = Math.min(wdLen - 1, Math.floor(Math.random() * (1 + wdLen)));
            const c = this.wordsSelectRandom[index];
            //if (!this.isWordOk(c)) {
            res = res + c;
            i++;
            //}
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
                if (!this.isWordOk(c)) {
                    res = res + c;
                    selectNum++;
                }
            }
        }
        if (findNum >= this.props.article.length) {
            return this.selectFromWords();
        }

        return res;
    }
    selectArticle() {
        return this.selectFromWords();
        /*
        if (!this.props.article) {
          return this.selectFromWords();
        }
        return this.selectFromArticle();
        */
        //    return this.selectFromArticle();
    }
    text() {
        //        this.props.goalWordSpeed;
        const num = this.props.wdLen || 10;
        const now = new Date().getTime() / 10;
        const wordsSpeed = num * 100 * 60 / (now - this.startTime);

        console.log("current word speed = ", wordsSpeed, this.props.goalWordSpeed, this.props.currentGrade, this.props.goalSpeed);


        if ((this.props.currentGrade >= this.props.goalSpeed && wordsSpeed >= this.props.goalWordSpeed) || this.wordsSelect.length < 5) {
            let allOk = true;
            console.log("check ok");
            for (let i = 0; i < this.wordsSelect.length; i++) {
                if (!this.isWordOk(this.wordsSelect[i])) {
                    console.log("Error:", this.wordsSelect[i])
                    allOk = false;
                    //break;
                }
            }
            if (allOk) {
                this.updateWordsSelect();
            }
        }
        return this.selectArticle();
    }

    saveGrade() {

    }

    update() {
        const text = this.text();
        this.everyWordsError = [];

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

    calculateOk() {
        const text = Object.assign([], this.state.text);
        this.allInfo.number += text.length;
        const d = new Date();
        const endTime = d.getTime() / 10;
        this.allInfo.time += (endTime - this.startTime);

        this.allInfo.days = this.allInfo.days || {};
        const todayStr = d.toLocaleDateString()

        let today = this.allInfo.days[todayStr] || {
            time: 0,
            number: 0,
            date: todayStr
        };

        today.time = today.time + (endTime - this.startTime);
        today.number = today.number + text.length;

        this.allInfo.days[todayStr] = today;

        db.setItem("all_info", JSON.stringify(this.allInfo));

        for (let i = 0; i < text.length; i++) {
            const c = text[i].c;

            this.everyWordsCount[c] = (this.everyWordsCount[c] || 0) + 1;
            const currentProb = Math.max(0, Math.min(1.0, this.everyWordsProb[c] || 0.5));

            if (this.everyWordsError[i]) {
                this.everyWordsProb[c] = currentProb * 0.9;
                this.wordsSelectRandom += c;
            } else {
                this.everyWordsProb[c] = currentProb * 0.9 + 0.1;
            }
        }

        for (let i = 0; i < this.wordsSelect.length; i++) {
            const c = this.wordsSelect[i];
            if (this.isWordOk(c)) {
                if (this.wordsSelectRandom.indexOf(c) != this.wordsSelectRandom.lastIndexOf(c)) {
                    this.wordsSelectRandom.replace(c, "");
                }
            } else {
                this.wordsSelectRandom += c;
            }
        }
        db.setItem("wordsProbs", JSON.stringify(this.everyWordsProb));

        console.log(this.everyWordsProb);
    }

    onStart() {
        this.startTime = new Date().getTime() / 10;
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
                this.everyWordsError[i] = true;
            }

            text[i] = zi;
        }
        if (code.length == this.state.text.length && allOk) {
            this.grade.errorNumber = 0;
            for (let i in this.everyWordsError) {
                if (this.everyWordsError[i]) {
                    this.grade.errorNumber += 1;
                }
            }

            this.calculateOk();
            this.props.onReset(this.grade);
            this.update();
            return;
        }
        this.setState({ text: text, currentIndex: count });
    }

    OneProbC(c, i) {
        const dCount = this.everyWordsCount[c] || 0;
        const prob = this.everyWordsProb[c] || 0.5;
        let probPercent = Math.floor(prob * 255);

        if (probPercent < 0) { probPercent = 0 };
        if (probPercent > 255) { probPercent = 255 };

        const color = ((255 - probPercent) << 16) | (probPercent << 8);

        let colorString = `000000${color.toString(16)}`;

        colorString = "#" + colorString.substr(-6);
        const probPercentShow = parseInt(probPercent * 100 * 10 / 255) / 10;

        return <OneProbC c={c} color={colorString} key={`index_${i}`} id={`c_${c}`} percent={probPercentShow} />;
    }

    render() {
        //  const helpInfo = this.props.article ? "从文章中选择以下文字：" : "随机选择以下文字：";
        const helpInfo = "随机选择以下文字："
        const text = this.wordsSelect.split("");
        return <Card>
            <CardHeader>文本</CardHeader>
            <CardBody>
                <FormText color="muted">
                    {helpInfo} {text.map(this.OneProbC)}
                </FormText>
                <hr />
                <div className="flex">
                    {this.state.text.map(this.OneCharacter)}
                </div>
            </CardBody>
        </Card>
    }
}

class OneProbC extends Component {
    constructor(props) {
        super(props);
        this.state = { show: true };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            state: !this.state.show
        });
    }

    render() {
        return (<span>
            <a id={this.props.id} style={{ color: this.props.color, cursor: "pointer" }}>{this.props.c}</a>
            <UncontrolledTooltip placement="top" target={this.props.id}>
                正确率：{this.props.percent}%
      </UncontrolledTooltip>
        </span>);
    }

}

class Keyboard extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.reset = this.reset.bind(this);

        this.state = {
            value: "",
            simple: parseInt(db.getItem("simple")) || 0
        };
        this.start = false;
    }

    onKeyDown(e) {
        if (!this.start) {
            this.start = true;
            this.props.onStart();
        }
        this.props.onKeyDown(e);
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

    componentDidMount() {
        this.refs["input"].focus();
    }

    render() {
        return <div ref="origin_position"><div ><Card>
            <textarea className="form-control form-control-sm text-muted" rows={this.state.simple == 1 ? 1 : 4} onKeyDown={this.onKeyDown} onChange={this.onChange} value={this.state.value} ref="input" style={{ backgroundColor: "transparent", border: "0 solid" }} placeholder="在这里输入……" />
        </Card>
        </div></div>
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
            goalWordSpeed: parseInt(db.getItem("goalWordSpeed")) || 30,
            wdLen: parseInt(db.getItem("currentLen")) || 10,
            article: db.getItem("article") || ""
        }
    }

    onInput(e) {
        this.refs["text"].onInput(e);
    }

    onStart() {
        this.refs.grade.onStart();
        this.refs.text.onStart();
    }

    onKeyDown(e) {
        this.refs.grade.onKeyDown(e);
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
        console.log(this.state);
        return (
            <div className="flex-center">
                <Text currentGrade={this.state.currentGrade} goalSpeed={this.state.goalSpeed || 2} goalWordSpeed={this.state.goalWordSpeed || 30} article={this.state.article} wdLen={this.state.wdLen} ref="text" onReset={this.onReset} />
                <Keyboard ref="input" onInput={this.onInput} onStart={this.onStart} onKeyDown={this.onKeyDown} />
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
            wordsSpeed: parseFloat(db.getItem("wordsSpeed") || "0"),
            eachWordKey: parseFloat(db.getItem("eachWordKey") || "0")
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
        this.testId = 0;
    }

    currentTime() {
        return new Date().getTime();
    }

    onStart() {
        this.currentGrade.startTime = this.currentTime();
    }

    onKeyDown(e) {
        const current = this.currentTime();
        var keyNum = this.currentGrade.keyNum;
        var speed;
        keyNum++;

        /*
                if (e) {
                    this.testId++;
                    console.log(e.key, this.testId)
                }
        
                if (typeof e != "undefined" && typeof e.key != "undefined") {
                    const validKey = "qwertyuiopasdfghjklzxcvbnm1234567890";
                    if (validKey.indexOf(e.key) >= 0) {
                        console.log("++")
                    }
        
                }
        */
        speed = keyNum * 1000 / (current - this.currentGrade.startTime);
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
        if (arr.length >= 200) {
            const newArr = [];
            for (let i = 0; i < arr.length; i += 2) {
                let newObj = {};
                const i1 = i;
                const i2 = i1 + 1 > arr.length - 1 ? i1 : i1 + 1;

                for (var key in arr[i]) {
                    newObj[key] = (arr[i1][key] + arr[i2][key]) / 2;
                }

                newObj.time = Math.floor(newObj.time);

                newArr.push(newObj);
            }
            arr = newArr;
        }

        const output = JSON.stringify(arr);

        db.setItem("history", output);
    }

    onEnd(grade) {
        this.onKeyDown();
        const error = grade.errorNumber / grade.length;
        const current = this.currentTime();

        const wordsSpeed = grade.length * 1000 * 60 / (current - this.currentGrade.startTime);

        const eachWordKey = Math.floor((this.currentGrade.speed * 60) / wordsSpeed * 100) / 100;

        const data = {
            speed: this.currentGrade.speed,
            error: error,
            wordsSpeed: wordsSpeed,
            eachWordKey: eachWordKey
        };

        this.setState(data);

        db.setItem("speed", this.currentGrade.speed.toString());
        db.setItem("error", error.toString());
        db.setItem("wordsSpeed", data.wordsSpeed.toString());
        db.setItem("eachWordKey", data.eachWordKey.toString());

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
                击键：{parseInt(this.state.speed * 100) / 100} {" | "}
                打字：{parseInt(this.state.wordsSpeed * 100) / 100} {" | "}
                码长：{this.state.eachWordKey} {" | "}
                错误：{parseInt(this.state.error * 100)}%
      </CardBody>
        </Card>
    }
}

export default Typing;