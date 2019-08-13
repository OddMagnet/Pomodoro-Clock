import React, { Component } from 'react';
import TimerControl from './Components/TimerControl';
import beep from './Ressources/beep-07.wav';


// Self adjusting timer
// Both setTimeout and setInterval are prone to piling up small bits of extra time
// After some googling I found that most people use the Date() function to calculate
// and correct the timer. 
// Below is an interval function that calls a given function on a self adjusted timer
// and returns a function to stop its execution
const pomoInterval = (fn, intervalTime) => {
  // define variables for the wrapper, cancel and timeout function
  var wrapper, cancel, timeout = null;
  // calculate next tick
  var nextAt = new Date().getTime() + intervalTime;

  // wrapper function that calls itself every tick, executing the given function
  wrapper = () => {
    nextAt += intervalTime;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime()); // self correcting every time
    return fn();
  }

  // cancel function so the pomoInterval can be cancelled from outside
  cancel = () => {
    return clearTimeout(timeout);
  }

  // set the 1st timeout, starting the intervals
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());

  // finally, return the cancel function
  return {
    cancel: cancel
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerRunning: false,      // true
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

  // both setBreakLength and setSessionLength call the same function
  // keep it DRY
  setBreakLength = (event) => {
    this.lengthControl(
      'breakLength',              // which length will be adjusted
      event.currentTarget.value,  // add or sub from the length
      this.state.breakLength,     // the current length
      'Break'                     // check current timerType against this
                                  // to determine if timer needs reset
    );
  }
  setSessionLength = (event) => {
    this.lengthControl(
      'sessionLength',
      event.currentTarget.value,
      this.state.sessionLength,
      'Session'
    );
  }

  // function to adjust timer length and reset timer if need be
  lengthControl = (timerToChange, addsub, currentLength, timerType) => {
    // no adjustments when timer is currently running
    if (this.state.timerRunning) { return; }
    // if active (but paused) timerType === timerType, then reset the timer
    if (this.state.timerType === timerType) {
      if (addsub === '-' && currentLength !== 1) {  // can't go below 1
        this.setState({
          [timerToChange]: currentLength - 1,
          timer: currentLength * 60 - 60    // subtracting the minute
        });
      } else if (addsub === '+' && currentLength !== 60) {  // can't go above 60 either
        this.setState({
          [timerToChange]: currentLength + 1,
          timer: currentLength * 60 + 60    // adding the minute
        });
      }
    } else {  // time for the other timerType can be adjusted freely
      if (addsub === '-' && currentLength !== 1) {
        this.setState({ [timerToChange]: currentLength -1 })
      } else if (addsub === '+' && currentLength !== 60) {
        this.setState({ [timerToChange]: currentLength + 1 });
      }
    }
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
          title='Session Length'
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
