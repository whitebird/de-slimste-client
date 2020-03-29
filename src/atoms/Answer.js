import React, { Component } from 'react';

export default class Answer extends Component {
  render() {
    const { hit, found } = this.props;

    let answerStyle = {
      paddingBottom: 50
    };
    if (!found) {
      answerStyle.color = 'transparent';
      answerStyle.textShadow = '0 0 30px black';
    }
    return <div style={answerStyle}>{hit}</div>;
  }
}
