import React, { Component } from 'react';

export default class PlayerClock extends Component {
  render() {
    const { player, timerRunning } = this.props;
    const { name, time, active, played } = player;

    let nameStyle = {};

    if (active) {
      nameStyle.fontWeight = 'bold';
      nameStyle.textDecoration = 'underline';
      if (timerRunning) {
        nameStyle.color = '#ea7445';
      }
    }

    return (
      <div
        style={{
          width: '200px',
          textAlign: 'center',
          marginTop: 60
        }}
      >
        <div style={nameStyle}>{name}</div>
        <div>{Math.floor(time / 10)}</div>
        {/* <div>{active.toString()}</div>
        <div>{played ? 'true' : 'false'}</div> */}
      </div>
    );
  }
}
