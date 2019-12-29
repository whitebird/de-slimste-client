import React, { Component } from 'react';
import io from 'socket.io-client';

export default class Presenter extends Component {
  constructor(props) {
    super(props);
    // This session is a presenter
    this.socket = io(this.props.socketEndpoint, {
      query: { presenter: true }
    });
    console.log('connected');
    this.socket.on('connect', () => {
      this.setState({ connected: true });
    });
    this.socket.on('disconnect', () => {
      this.setState({ connected: false });
    });
    this.socket.on('onUserConnect', ({ connectedUsers, gameState }) => {
      console.dir('onUserConnect', { connectedUsers, gameState });
      this.setState({ connectedUsers, gameState });
    });
    this.socket.on('gameStateUpdate', gameState => {
      console.log('Got gamestate update');
      console.log(gameState);
      this.setState({ gameState });
    });
    this.state = {
      isPresenter: true,
      gameState: { round: 0, players: [] },
      connectedUsers: []
    };
  }
  selectPlayer = id => {
    console.log('selected player', id);
    this.socket.emit('selectPlayer', id);
  };

  removePlayer = id => {
    console.log('removed player', id);
    this.socket.emit('removePlayer', id);
  };

  advanceRound = () => {
    this.socket.emit('advanceRound', this.state.gameState.round);
  };

  render() {
    const { gameState, connectedUsers, connected } = this.state;

    if (!connected) {
      return <div>Not connected to server</div>;
    }

    const connectedUsersLi = connectedUsers.map(user => (
      <li key={user.id + 'cnctd'} onClick={() => this.selectPlayer(user.id)}>
        {user.name}
      </li>
    ));

    const selectedPlayersLi = gameState.players.map(player => (
      <li key={player.id + 'slctd'}>
        <button onClick={() => this.removePlayer(player.id)}>X</button>
        {player.name}
      </li>
    ));

    return (
      <div>
        <div>
          Connected players:<ul>{connectedUsersLi}</ul>
        </div>
        <div>
          Selected players: <ul>{selectedPlayersLi}</ul>
        </div>
        <button onClick={this.advanceRound}>Start</button>
      </div>
    );
  }
}
