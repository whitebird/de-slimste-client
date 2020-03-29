import React, { Component } from 'react';
import PlayerClock from '../../atoms/PlayerClock';
import Answer from '../../atoms/Answer';

export default class Round5 extends Component {
  render() {
    const { gameState } = this.props;
    const { players, answers, timerRunning } = gameState;

    console.log('hoi', gameState);

    if (!players || players.length !== 2) {
      return <div>Need Exactly two player</div>;
    }

    if (!answers) {
      return <div>No answers given</div>;
    }

    return (
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#a4100d',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        <h2 style={{ fontSize: '3em' }}>Finale</h2>
        {/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
        <div style={{ height: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              height: '50%',
              fontSize: '3em'
            }}
          >
            <PlayerClock player={players[0]} timerRunning={timerRunning} />
            <PlayerClock player={players[1]} timerRunning={timerRunning} />
          </div>
          <div style={{ height: '50%', fontSize: '3em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Answer hit={answers[0].hit} found={answers[0].found} />
              <Answer hit={answers[1].hit} found={answers[1].found} />
              <Answer hit={answers[2].hit} found={answers[2].found} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Answer hit={answers[3].hit} found={answers[3].found} />
              <Answer hit={answers[4].hit} found={answers[4].found} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
