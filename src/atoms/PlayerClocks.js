import React, { Component } from 'react';
import PlayerClock from './PlayerClock';

export default class PlayerClocks extends Component {
  render() {
    const { players } = this.props;
    if (!players) {
      return null;
    }
    const playerClocks = players.map(player => {
      return <PlayerClock key={player.id + 'clock'} player={player} />;
    });
    return <div style={{ display: 'flex' }}>{playerClocks}</div>;
  }
}
