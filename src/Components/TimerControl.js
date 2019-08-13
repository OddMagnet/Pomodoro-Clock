import React, { Component } from 'react';

class TimerControl extends Component {
    // Passing most stuff via props to make the component reusable
    // for both session and break length control
    render() {
        return (
            <div className='length-control'>
                <div id={this.props.titleID}>{this.props.title}</div>
                <button
                    className='btn-control'
                    id={this.props.subID}
                    onClick={this.props.onClick}
                    value='-'
                >
                    <i class="fa fa-arrow-down fa-2x"></i>
                </button>
                <div className='btn-control' id={this.props.lengthID}>
                    {this.props.length}
                </div>
                <button
                    className='btn-control'
                    id={this.props.addID}
                    onClick={this.props.onClick}
                    value='+'
                >
                    <i class="fa fa-arrow-up fa-2x"></i>
                </button>
            </div>
        )
    }
}

export default TimerControl;