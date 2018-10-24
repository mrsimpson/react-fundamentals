import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Player from './Player';
import GithubApi from '../utils/GithubApi';

function PlayerFactsheet(props) {
  const handleReset = props.onReset.bind(null, props.id);
  return (
    <form className="player-factsheet column">
      <div className="header">{props.username}</div>
      <img className="avatar" src={props.avatarUrl} />
      <button className="link" type="button" onClick={handleReset}>reset</button>
    </form>
  );
}

PlayerFactsheet.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneUsername: '',
      playerOneAvatarUrl: '',
      playerTwoUsername: '',
      playerTwoAvatarUrl: '',
    };

    this.handlePlayerSelected = this.handlePlayerSelected.bind(this);
    this.handlePlayerReset = this.handlePlayerReset.bind(this);
  }

  async handlePlayerSelected(id, username) {
    const newState = {};
    newState[`${id}Username`] = username;
    newState[`${id}AvatarUrl`] = await GithubApi.getUserAvatarUrl(username);
    this.setState(newState);
  }

  handlePlayerReset(id) {
    const newState = {};
    newState[`${id}Username`] = '';
    newState[`${id}AvatarUrl`] = '';
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <div className="row battle">
          {!this.state.playerOneUsername
            ? (
              <Player
                id="playerOne"
                label="Player One"
                onSubmit={this.handlePlayerSelected}
              />
            )
            : (
              <PlayerFactsheet
                username={this.state.playerOneUsername}
                avatarUrl={this.state.playerOneAvatarUrl}
                id="playerOne"
                onReset={this.handlePlayerReset}
              />
            )
        }
          {!this.state.playerTwoUsername
            ? (
              <Player
                id="playerTwo"
                label="Player Two"
                onSubmit={this.handlePlayerSelected}
              />
            )
            : (
              <PlayerFactsheet
                username={this.state.playerTwoUsername}
                avatarUrl={this.state.playerTwoAvatarUrl}
                id="playerTwo"
                onReset={this.handlePlayerReset}
              />
            )
        }
        </div>
        <div className="row">
          <button type="button" className="button" disabled={!this.state.playerOneUsername || !this.state.playerTwoUsername}>Battle!</button>
        </div>
      </div>
    );
  }
}
