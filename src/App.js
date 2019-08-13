import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: 'isStopped',  // 'isRunning'
      timerType: 'Session',     // 'Break'
      timer: 1500,              // timer in seconds, 25*60 = 1500
      intervalID: '',
      alarmColor: { color: 'white' }  // default of white, setting to red when < 60s
    }
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Clock</h1>
      </div>
    );
  }
}

export default App;
