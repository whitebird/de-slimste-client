import React, { Component } from 'react';
import PlayerClocks from '../../atoms/PlayerClocks';

export default class Round1 extends Component {
  render() {
    const { gameState } = this.props;
    const { currentQuestion } = gameState;
    console.log('currentQuestion', currentQuestion);

    const numbers = [...Array(15).keys()].map(i => {
      let style = {};
      if (i + 1 === currentQuestion) {
        style = { fontWeight: 'bold' };
      }
      return (
        <span key={'question' + i} style={style}>
          {i + 1}
        </span>
      );
    });

    return (
      <div>
        <h2>3-6-9</h2>
        <PlayerClocks players={gameState.players} />
        <div>{numbers}</div>
      </div>
    );
  }
}
