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

  // toggle timer between running and paused
  toggleTimer = () => {
    if (!this.state.timerRunning) {
      this.startCountDown();
      this.setState({ timerRunning: true });
    } else {
      this.setState({ timerRunning: false });
      if (this.state.intervalID) {
        this.state.intervalID.cancel();   // stop the pomoInterval
      }
    }
  }
  // start the countdown
  startCountDown = () => {
    this.setState({
      intervalID: pomoInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000)
    });
  }
  // decreases timer by 1s
  decrementTimer = () => {
    this.setState({ timer: this.state.timer - 1 });
  }

  // handles last minute color, beeping and initiating the switch of phases
  phaseControl = () => {
    let timer = this.state.timer;
    this.checkForLastMinute(timer);
    this.beeper(timer);
    if (timer < 0) {
      // cancel interval when timer hits 0
      if (this.state.intervalID) { this.state.intervalID.cancel(); }
      // Start new Countdown
      this.startCountDown();
      // Check timerType, switch to the other one
      if (this.state.timerType === 'Session') {
        this.switchTimerType(this.state.breakLength * 60, 'Break');
      } else {
        this.switchTimerType(this.state.sessionLength * 60, 'Session');
      }
    }
  }

  // check if timer is in the last minute, if so change text color
  checkForLastMinute = (t) => {
    if (t < 61) { this.setState({ alarmColor: { color: '#a50d0d' } }); }
    else { this.setState({ alarmColor: { color: 'white' } }) }
  }

  // play the beep if timer hits 0
  beeper = (t) => {
    if (t === 0) {
      this.playBeep.play();
    }
  }

  // switch timer to type with length
  switchTimerType = (length, type) => {
    this.setState({
      timer: length,
      timerType: type,
      alarmColor: { color: 'white' }
    });
  }

  // reset timer to default values
  resetTimer = () => {
    // reset state
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerRunning: false,
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' }
    })
    // make sure intervals are cancelled
    if (this.state.intervalID) { this.state.intervalID.cancel() }
    // make sure beep sounds are paused and reset the sound time
    this.playBeep.pause();
    this.playBeep.currentTime = 0;
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
