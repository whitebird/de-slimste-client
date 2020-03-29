import React, { Component } from 'react';
import uuid from 'uuid/v4';
import io from 'socket.io-client';
import Setup from './Setup';
import Round1 from './Round1';
import Round2 from './Round2';
import Round5 from './Round5';

function getOrSetId() {
  const id = localStorage.getItem('id');
  if (id === null) {
    const newId = uuid();
    localStorage.setItem('id', newId);
    return newId;
  }
  return id;
}

export default class Player extends Component {
  constructor(props) {
    super(props);
    // This session is a player
    const id = getOrSetId();
    console.log('id', id);
    this.socket = io(this.props.socketEndpoint, { query: { id } });
    console.log('connected');
    this.socket.on('onConnect', ({ name, gameState }) => {
      // console.log('onConnect', { name, gameState });
      this.setState({ name, gameState, connected: true });
    });
    this.socket.on('disconnect', () => {
      this.setState({ connected: false });
    });
    this.socket.on('gameStateUpdate', gameState => {
      console.log('Got gamestate update');
      console.log(gameState);
      this.setState({ gameState });
    });
    this.state = {
      id,
      name: '',
      gameState: { round: 0, players: [] }
    };
  }

  setName = name => {
    this.setState({ name });
  };

  confirmName = () => {
    const { id, name } = this.state;
    this.socket.emit('setName', { id, name });
  };

  render() {
    const { name, gameState, connected } = this.state;
    const { round } = gameState;

    if (!connected) {
      return <div>Not connected to server</div>;
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
        {round === 0 ? (
          <Setup
            setName={this.setName}
            confirmName={this.confirmName}
            name={name}
          />
        ) : null}
        {round === 1 ? <Round1 gameState={gameState} /> : null}
        {round === 2 ? <Round2 gameState={gameState} /> : null}
        {round === 5 ? <Round5 gameState={gameState} /> : null}
      </div>
    );
  }
}
