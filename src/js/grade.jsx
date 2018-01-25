import React, { Component } from "react";
import { Card, CardHeader, CardBody, Table } from "reactstrap";
import db from './storage';

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

class Grade extends Component {
  constructor(props) {
    super(props);

    const str = db.getItem("history") || "[]";
    const data = JSON.parse(str) || [];
    this.state = {
      data: data.reverse()
    };
  }
  render() {
    return (<Card>
      <CardHeader>成绩</CardHeader>
      <CardBody>
        <Table striped hover size="sm">
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
      </CardBody>
    </Card>);
  }
}

export default Grade;