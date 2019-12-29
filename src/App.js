import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import uuid from 'uuid/v4';
import Setup from './components/Setup';

const styles = theme => ({
  root: {}
});

// Rondes zijn
// 0: Setup
// 1: 3-6-9
// 2

function getOrSetId() {
  const id = localStorage.getItem('id');
  if (id === null) {
    const newId = uuid();
    localStorage.setItem('id', newId);
    return newId;
  }
  return id;
}

class App extends Component {
  constructor(props) {
    super(props);

    const presenter = new URL(window.location).searchParams.get('presenter');
    if (presenter === null) {
      // This session is a player
      const id = getOrSetId();
      console.log('id', id);
      this.socket = io('http://localhost:5000', { query: { id } });
      console.log('connected');
      this.socket.on('onConnect', ({ name, gameState }) => {
        // console.log('onConnect', { name, gameState });
        this.setState({ name, gameState });
      });
      this.socket.on('gameStateUpdate', gameState => {
        console.log('Got gamestate update');
        console.log(gameState);
        this.setState({ gameState });
      });
      this.state = {
        id,
        name: '',
        gameState: { round: 0 }
      };
    } else {
      // This session is a presenter
      this.socket = io('http://localhost:5000', { query: { presenter: true } });
      console.log('connected');
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
        gameState: { round: 0 },
        connectedUsers: []
      };
    }
  }

  setName = name => {
    this.setState({ name });
  };

  confirmName = () => {
    const { id, name } = this.state;
    this.socket.emit('setName', { id, name });
  };

  selectPlayer = id => {
    console.log('selected player', id);
    this.socket.emit('selectPlayer', id);
  };

  render() {
    const { classes } = this.props;
    const { isPresenter, gameState, name } = this.state;
    const { round } = gameState;

    if (isPresenter) {
      const { connectedUsers } = this.state;
      const connectedUsersLi = connectedUsers.map(user => (
        <li key={user.id} onClick={() => this.selectPlayer(user.id)}>
          {user.name}
        </li>
      ));
      return (
        <div>
          Connected players:<ul>{connectedUsersLi}</ul>
          <button>Start</button>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        {round === 0 ? (
          <Setup
            setName={this.setName}
            confirmName={this.confirmName}
            name={name}
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(App);
