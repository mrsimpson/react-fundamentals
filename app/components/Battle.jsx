import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Player from './Player';
import GithubApi from '../utils/GithubApi';

function PlayerFactsheet({
  id, username, avatarUrl, onReset
}) {
  const handleReset = onReset.bind(null, id);
  return (
    <form className="player-factsheet column">
      <div className="header">{username}</div>
      <img alt={`Avatar for ${username}`} className="avatar" src={avatarUrl} />
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
    const {
      playerOneUsername, playerOneAvatarUrl, playerTwoUsername, playerTwoAvatarUrl
    } = this.state;

    return (
      <div>
        <div className="row battle">
          {!playerOneUsername
            ? (
              <Player
                id="playerOne"
                label="Player One"
                onSubmit={this.handlePlayerSelected}
              />
            )
            : (
              <PlayerFactsheet
                username={playerOneUsername}
                avatarUrl={playerOneAvatarUrl}
                id="playerOne"
                onReset={this.handlePlayerReset}
              />
            )
        }
          {!playerTwoUsername
            ? (
              <Player
                id="playerTwo"
                label="Player Two"
                onSubmit={this.handlePlayerSelected}
              />
            )
            : (
              <PlayerFactsheet
                username={playerTwoUsername}
                avatarUrl={playerTwoAvatarUrl}
                id="playerTwo"
                onReset={this.handlePlayerReset}
              />
            )
        }
        </div>
        <div className="row">
          <button type="button" className="button" disabled={!playerOneUsername || !playerTwoUsername}>Battle!</button>
        </div>
      </div>
    );
  }
}
