import React, { Component } from 'react';
import TimerControl from './Components/TimerControl';
import beep from './Ressources/beep-07.wav';

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

  timerToClock = () => {
    // calculate minutes and seconds
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer % 60;
    // Add extra 0's if needed
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    // return the formated time
    return minutes + ':' + seconds;
  }

  render() {
    return (
      <div>
        <h1 className='title'>Pomodoro Clock</h1>
        {/* Control for break length */}
        <TimerControl
          subID='break-decrement'
          addID='break-increment'
          length={this.state.breakLength}
          lengthID='break-length'
          onClick={this.setBreakLength}
          title='Break Length'
          titleID='break-label'
        />
        {/* Control for session length */}
        <TimerControl
          subID='session-decrement'
          addID='session-increment'
          length={this.state.sessionLength}
          lengthID='session-length'
          onClick={this.setSessionLength}
          title='session Length'
          titleID='session-label'
        />
        {/* Timer, just shows the time*/}
        <div className='timer' style={this.state.alarmColor}>
          <div className='timer-wrapper'>
            <div id='timer-label'>{this.state.timerType}</div>
            <div id='time-left'>{this.timerToClock()}</div>
          </div>
        </div>
        {/* Timer Control, Start/Pause and Reset */}
        <div className='timer-control'>
          <button id='start_stop' onClick={this.toggleTimer}>
            <i className='fa fa-play fa-2x' />
            <i className='fa fa-pause fa-2x' />
          </button>
          <button id='reset' onClick={this.resetTimer}>
            <i className='fa fa-refresh fa-2x' />
          </button>
        </div>
        {/* audio element for the beep sound */}
        <audio
          id='beep'
          preload='auto'
          ref={audio => {
            this.playBeep = audio;
          }}
          src={beep}
        />
      </div>
    );
  }
}

export default App;
