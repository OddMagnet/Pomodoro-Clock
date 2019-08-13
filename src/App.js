import React, { Component } from 'react';
import TimerControl from './Components/TimerControl';

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
        <TimerControl
          subID='break-decrement'
          addID='break-increment'
          length={this.state.breakLength}
          lengthID='break-length'
          onClick={this.setBreakLength}
          title='Break Length'
          titleID='break-label'
        />
      </div>
    );
  }
}

export default App;
