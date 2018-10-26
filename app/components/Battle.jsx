import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PlayerSelection, PlayerFactsheet } from './Player';
import GithubApi from '../utils/GithubApi';

export default class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneUsername: '',
      playerOneAvatarUrl: '',
      playerTwoUsername: '',
      playerTwoAvatarUrl: '',
    };

    this.api = new GithubApi();

    this.handlePlayerSelected = this.handlePlayerSelected.bind(this);
    this.handlePlayerReset = this.handlePlayerReset.bind(this);
  }

  async handlePlayerSelected(id, username) {
    const newState = {};
    newState[`${id}Username`] = username;
    newState[`${id}AvatarUrl`] = await this.api.getUserAvatarUrl(username);
    this.setState(newState);
  }

  handlePlayerReset(id) {
    const newState = {};
    newState[`${id}Username`] = '';
    newState[`${id}AvatarUrl`] = '';
    this.setState(newState);
  }

  render() {
    const { url } = this.props.match;

    const {
      playerOneUsername, playerOneAvatarUrl, playerTwoUsername, playerTwoAvatarUrl
    } = this.state;

    const boundHandlePlayerReset = id => this.handlePlayerReset.bind(null, id);

    return (
      <div className="battle">
        <div className="row">
          {!playerOneUsername
            ? (
              <PlayerSelection
                id="playerOne"
                label="PlayerSelection One"
                onSubmit={this.handlePlayerSelected}
              />
            )
            : (
              <PlayerFactsheet
                username={playerOneUsername}
                avatarUrl={playerOneAvatarUrl}
              >
                <button className="link" type="button" onClick={boundHandlePlayerReset('playerOne')}>reset</button>
              </PlayerFactsheet>
            )
        }
          {!playerTwoUsername
            ? (
              <PlayerSelection
                id="playerTwo"
                label="PlayerSelection Two"
                onSubmit={this.handlePlayerSelected}
              />
            )
            : (
              <PlayerFactsheet
                username={playerTwoUsername}
                avatarUrl={playerTwoAvatarUrl}
                id="playerTwo"
                onReset={this.handlePlayerReset}
              >
                <button className="link" type="button" onClick={boundHandlePlayerReset('playerTwo')}>reset</button>
              </PlayerFactsheet>
            )
        }
        </div>
        <div className="row">
          <Link
            className="button"
            style={{ display: (!playerOneUsername || !playerTwoUsername) ? 'none' : '' }}
            to={{
              pathname: `${url}/result`,
              search: `playerOne=${playerOneUsername}&playerTwo=${playerTwoUsername}`
            }}
          >
              Battle!
          </Link>
        </div>
      </div>
    );
  }
}
