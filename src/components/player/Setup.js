import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

class Setup extends Component {
  state = {
    name: '',
    hasConfirmed: false
  };

  onChangeName = e => {
    this.props.setName(e.target.value);
  };

  submit = () => {
    this.props.confirmName();
    this.setState({ hasConfirmed: true });
  };

  render() {
    const { classes, name } = this.props;
    const { hasConfirmed } = this.state;
    return (
      <div className={classes.root}>
        {hasConfirmed ? (
          <div>
            Hey {name}, je bent geregistreerd en je mag eventjes wachten.
            <button
              onClick={() => {
                this.setState({ hasConfirmed: false });
              }}
            >
              Ik wil toch mijn naam nog even veranderen
            </button>
          </div>
        ) : (
          <>
            Setup<label htmlFor="name">Naam</label>
            <input name="name" value={name} onChange={this.onChangeName} />
            <button onClick={this.submit} disabled={!name}>
              Kies naam
            </button>
          </>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Setup);
