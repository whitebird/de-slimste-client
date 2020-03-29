import React, { Component } from 'react';
import PlayerClocks from '../../atoms/PlayerClocks';

export default class Round2 extends Component {
  render() {
    const { gameState } = this.props;
    return (
      <div>
        <h2>Open Deur</h2>
        <PlayerClocks players={gameState.players} />
      </div>
    );
  }
}
