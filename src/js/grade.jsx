import React, { Component } from "react";
import { Card, CardHeader, CardBody, Table } from "reactstrap";
import db from './storage';
import echarts from "echarts";

class OneLine extends Component {
  render() {
    const d = this.props.data;
    const time = new Date(d.time)
    const dateS = time.toLocaleDateString();
    const timeS = time.toLocaleTimeString();
    return (<tr>
      <td>{dateS}{" "}{timeS}</td>
      <td>{parseInt(d.speed * 100) / 100}</td>
      <td>{parseInt(d.wordsSpeed * 100) / 100}</td>
      <td>{parseInt(d.error * 100)}%</td>
    </tr>)
  }
}
/*
class XZoBn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.width;
    const height = this.props.height;
    return (<Line points={[0, height, width, height]} stroke="grey" strokeWidth={5} />);
  }
}

class YZoBn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.width;
    const height = this.props.height;
    return (<Line points={[0, height, 0, 0]} stroke="grey" strokeWidth={5} />);
  }
}
*/
class Grade extends Component {
  constructor(props) {
    super(props);
    const str = db.getItem("history") || "[]";
    const data = JSON.parse(str) || [];
    this.state = {
      data: data//.reverse(),
    };
  }

  render() {
    return (
      <div>
        <Card className="full">
          <CardHeader>成绩</CardHeader>
          <CardBody className="full">
            <Speed data={this.state.data} />
          </CardBody>
        </Card>
        <AllInfo />
      </div>
    );
  }
}

class AllInfo extends Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(db.getItem("all_info")) || {
      number: 0,
      time: 0
    };
    this.OneLine = this.OneLine.bind(this);
    this.timeInfo = this.timeInfo.bind(this);
  }

  timeInfo({ time, number }) {
    const t = parseInt(time) / 100;
    let tShow = ""
    if (t < 60) {
      tShow = t.toString() + "秒";
    } else if (t < 3600) {
      const tMinute = parseInt(t / 60);
      const tSecond = parseInt(t) % 60;
      tShow = tMinute.toString() + "分" + tSecond.toString() + "秒";
    } else {
      let tMinute = parseInt(t / 60);
      const tHour = parseInt(tMinute / 60);
      tMinute = tMinute % 60;
      tShow = tHour.toString() + "时" + tMinute.toString() + "分";
    }

    const zi = number;
    let ziShow = ""
    if (zi < 1000) {
      ziShow = zi
    } else if (zi < 10000) {
      const ziK = parseInt(zi / 10) / 100;
      ziShow = ziK.toString() + "K";
    } else {
      const ziK = parseInt(zi / 100) / 100;
      ziShow = ziK.toString() + "万";
    }
    const speed = parseInt(zi / Math.max(t, 1) * 60)
    const speedShow = speed.toString() + "字/分";

    return {
      time: tShow,
      number: ziShow,
      speed: speedShow
    }
  }

  OneLine(d, i) {
    const info = this.timeInfo(d);
    return <tr key={i}>
      <td>{d.date}</td>
      <td>{info.time}</td>
      <td>{info.number}</td>
      <td>{info.speed}</td>
    </tr>
  }

  render() {

    const allInfo = this.timeInfo(this.state);

    const allDays = this.state.days || {};
    let allDaysArr = [];

    console.log(allDays);

    for (let i in allDays) {
      allDaysArr.push(allDays[i]);
    }

    allDaysArr.reverse();

    return (
      <Card>
        <CardHeader>
          统计
        </CardHeader>
        <CardBody>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>-</th>
                <th>总时间</th>
                <th>总字数</th>
                <th>均速</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>全部</td>
                <td>{allInfo.time}</td>
                <td>{allInfo.number}</td>
                <td>{allInfo.speed}</td>
              </tr>
              {allDaysArr.map(this.OneLine)}
            </tbody>
          </Table>
        </CardBody>
      </Card>)
  }
}

class Speed extends Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.setTimeOut = this.setTimeOut.bind(this);
    this.tooltip = this.tooltip.bind(this);
    this.chart = null;
  }

  tooltip(params) {
    const time = new Date(this.props.data[params[0].name].time);
    const dateS = time.toLocaleDateString();
    const timeS = time.toLocaleTimeString();

    if (params.length == 2) {
      return dateS + " " + timeS + '<br />'
        + params[0].seriesName + ' : ' + params[0].value + ' (次/秒)<br />'
        + params[1].seriesName + ' : ' + params[1].value + ' (字/分)';
    } else if (params.length == 1) {
      if (params[0].seriesName == "击键") {
        return dateS + " " + timeS + '<br />'
          + params[0].seriesName + ' : ' + params[0].value + " (次/秒)";
      } else {
        return dateS + " " + timeS + '<br />'
          + params[0].seriesName + ' : ' + params[0].value + ' (字/分)';
      }
    } else {
      return dateS + " " + timeS;
    }

  }

  ave(...data) {
    var d = 0;
    data.map(v => { d = d + v });
    d = d / data.length;
    return d || 0;
  }

  draw() {
    this.chart = echarts.init(this.refs["chart"]);
    let timeList = [];
    let speedList = [];
    let speedWordsList = [];

    this.props.data.map((d, i) => {
      timeList.push(i);
      speedList.push(Math.floor(d.speed * 10) / 10);
      speedWordsList.push(Math.floor(d.wordsSpeed * 10) / 10);
    });

    const maxSpeed = Math.ceil(Math.max(...speedList) / 2) * 2 || 2;
    const maxSpeedWords = Math.ceil(Math.max(...speedWordsList) / 20) * 20 || 20;

    const minSpeed = Math.floor(Math.min(...speedList) / 2) * 2 || 1;
    const minSpeedWords = Math.floor(Math.min(...speedWordsList) / 20) * 20 || 10;

    const aveSpeed = this.ave(...speedList);
    const aveSpeedWords = this.ave(...speedWordsList);

    const dData = Math.ceil((aveSpeed - aveSpeedWords / 30));

    const interval = ((maxSpeedWords - minSpeedWords) / (maxSpeed - minSpeed));
    this.chart.setOption({
      title: {
        text: ''
      },
      xAxis: {
        data: timeList,
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true }
      },
      tooltip: {
        trigger: 'axis',
        formatter: this.tooltip
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['击键', '打字'],
        x: 'left'
      },
      yAxis: [
        {
          name: '击键（次/秒）',
          type: 'value',
          max: maxSpeed,// 10 + dData,
          min: minSpeed,//dData,
          axisLabel: {
            formatter: function (value) { return value; }
          }
        },
        {
          name: '打字速度（字/分）',
          type: 'value',
          max: maxSpeedWords,
          interval: interval,
          min: minSpeedWords,
          axisLabel: {
            formatter: function (value) { return Math.floor(value); }
          },
          show: true
        }
      ],
      series: [{
        name: '击键',
        type: 'line',
        smooth: 0.5,
        data: speedList

      }, {
        yAxisIndex: 1,
        name: '打字',
        type: 'line',
        smooth: 0.5,
        data: speedWordsList

      }]
    })
  }

  setTimeOut() {
    if (this.chart != null) {
      this.chart.resize();
    }
  }
  componentDidMount() {
    setTimeout(this.draw, 10);
    window.addEventListener("resize", this.setTimeOut);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setTimeOut);

  }
  render() {
    return (<div ref="chart" style={{ width: "100%", height: 300 }}></div>);
  }
}

export default Grade;

/*


import React, {Component} from "react";
import Konva from "konva";
import {render} from "react-dom";
import {Stage, Layer, Rect, Text,Line } from "react-konva";

class ColoredRect extends React.Component {
            state = {
              color: "green"
            };
          handleClick = () => {
            this.setState({
              color: Konva.Util.getRandomColor()
            });
          };
  render() {
    return (

      <Line points={[1, 20, 20, 10, 50, 50]} lineCap='round'
            lineJoin='round' stroke="red" strokeWidth={3} tension={1} />

          );
  }
}
class App extends Component {
            render() {
          return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              <Text text="Try click on rect" />
              <ColoredRect />
            </Layer>
          </Stage>
          );
  }
}
    */
    /*  <Table striped hover size="sm">
            <thead>
              <tr>
                <th>时间</th>
                <th>击键</th>
                <th>打字</th>
                <th>错误率</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(d => <OneLine key={d.time} data={d} />)}
            </tbody>
          </Table>
          */
