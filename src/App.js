import React, { Component } from 'react';
import Presenter from './components/presenter/Presenter';
import Player from './components/player/Player';

// Rondes zijn
// 0: Setup
// 1: 3-6-9
// 2

export default class App extends Component {
  constructor(props) {
    super(props);
    const presenter = new URL(window.location).searchParams.get('presenter');
    console.log('presenter', presenter);
    this.state = { isPresenter: presenter !== null };
  }

  render() {
    const { isPresenter } = this.state;

    if (isPresenter) {
      return <Presenter socketEndpoint="http://192.168.0.244:5000" />;
    }

    return <Player socketEndpoint="http://192.168.0.244:5000" />;
  }
}
