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
      connectedUsers: [],
      editAnswers: false
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

  toggleEditAnswers = () => {
    console.log('toggleEditAnswers', this.state.editAnswers);
    this.setState(state => ({ editAnswers: !state.editAnswers }));
  };

  selectNextPlayer = () => {
    this.socket.emit('selectNextPlayer');
  };

  nextQuestion = () => {
    this.socket.emit('nextQuestion');
  };

  addTimeToSelectedPlayer = () => {
    this.socket.emit('addTimeToSelectedPlayer');
  };

  toggleTimer = () => {
    this.socket.emit('toggleTimer');
  };

  foundAnswer = hit => {
    this.socket.emit('foundAnswer', hit);
  };

  showAllAnswers = () => {
    this.socket.emit('showAnswers');
  };

  submitAnswers = e => {
    e.preventDefault();
    this.socket.emit('setAnswers', [
      e.target[0].value,
      e.target[1].value,
      e.target[2].value,
      e.target[3].value,
      e.target[4].value
    ]);
  };

  submitTime = e => {
    console.log('submitTime');
    e.preventDefault();
    this.socket.emit('setTime', [e.target[0].value, e.target[1].value]);
  };

  render() {
    const { gameState, connectedUsers, connected, editAnswers } = this.state;
    const { round, players } = gameState;

    if (!connected) {
      return <div>Not connected to server</div>;
    }

    const connectedUsersLi = connectedUsers.map(user => (
      <li key={user.id + 'cnctd'} onClick={() => this.selectPlayer(user.id)}>
        {user.name}
      </li>
    ));

    const selectedPlayersLi = players.map(player => (
      <li key={player.id + 'slctd'}>
        <button onClick={() => this.removePlayer(player.id)}>X</button>
        {player.name}
      </li>
    ));

    const buttons = (
      <>
        <button onClick={this.selectNextPlayer}>Next player</button>
        <button onClick={this.nextQuestion}>Next Question</button>
        <button onClick={this.addTimeToSelectedPlayer}>
          Add time to Selected Player
        </button>
        <button onClick={this.advanceRound}>Next round</button>
        <div>
          <button onClick={this.toggleTimer}>toggle timer</button>
        </div>
      </>
    );

    if (round === 5) {
      const { answers, timerRunning } = gameState;
      const answerItems = answers.map((answer, i) => {
        let style = {};
        if (answer.found) {
          style.textDecoration = 'line-through';
        }
        return (
          <li
            key={answer.hit + 'anqr' + i}
            style={style}
            onClick={() => this.foundAnswer(answer.hit)}
          >
            {answer.hit}
          </li>
        );
      });

      let editableAnswers = null;

      if (editAnswers) {
        editableAnswers = answers.map((answer, i) => {
          return (
            <li key={'answeredit' + i}>
              <input name={'answer' + i} defaultValue={answer.hit} />
            </li>
          );
        });
      }

      return (
        <div style={{ color: 'black' }}>
          {buttons}
          <button onClick={this.showAllAnswers}>Show all answers</button>
          <ul>{answerItems}</ul>
          <button onClick={this.toggleEditAnswers}>Toggle edit answers</button>
          {editableAnswers ? (
            <form onSubmit={this.submitAnswers}>
              <ul>{editableAnswers}</ul>
              <button type="submit">Set answers</button>
            </form>
          ) : null}
          <form onSubmit={this.submitTime}>
            <ul>
              <li>
                {players[0].name}
                <input
                  name="player1"
                  type="input"
                  defaultValue={players[0].time}
                />
              </li>
              <li>
                {players[1].name}
                <input
                  name="player2"
                  type="input"
                  defaultValue={players[1].time}
                />
              </li>
            </ul>
            <button type="submit">Set time</button>
          </form>
          <h2>TIMER RUNNING: {timerRunning.toString()}</h2>
        </div>
      );
    }

    return (
      <div style={{ color: 'black' }}>
        <div>
          Connected players:<ul>{connectedUsersLi}</ul>
        </div>
        <div>
          Selected players: <ul>{selectedPlayersLi}</ul>
        </div>

        {round === 5 ? null : null}

        {round === 0 ? (
          <button onClick={this.advanceRound}>Start</button>
        ) : (
          buttons
        )}
      </div>
    );
  }
}
