import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { debounce } from 'lodash';
import GithubApi from '../utils/GithubApi';

export function PlayerFactsheet({
  username, avatarUrl, children
}) {
  return (
    <form className="player-factsheet column">
      <img alt={`Avatar for ${username}`} className="avatar" src={avatarUrl} />
      <div className="username">{`@${username}`}</div>
      {children}
    </form>
  );
}

PlayerFactsheet.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
};

export class PlayerSelection extends Component {
  static defaultProps = {
    username: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      label: props.label,
      username: props.username,
      isValid: false,
      onSubmit: props.onSubmit,
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.debounceValidateUsername = debounce(this.validateUsername, 300);

    this.api = new GithubApi();
  }

  validateUsername() {
    const { username } = this.state;

    if (username) {
      this.api.isUsernameValid(username)
        .then(isValid => this.setState({ isValid }))
        .catch(() => this.setState({ isValid: false }));
    } else {
      this.setState({ isValid: false });
    }
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    });

    this.debounceValidateUsername();
  }

  handleSubmit(event) {
    const {
      isValid, id, username, onSubmit
    } = this.state;

    event.preventDefault();

    if (isValid) {
      onSubmit(id, username);
    }
  }

  render() {
    const { label, username, isValid } = this.state;
    return (
      <form className="column player" onSubmit={this.handleSubmit}>
        <label className="header" htmlFor="username">{label}</label>
        <input id="username" placeholder="username" className={!isValid && username ? 'error' : ''} value={username} autoComplete="off" onChange={this.handleUsernameChange} />
        <button type="submit" className="button" disabled={!isValid}>
          Submit
        </button>
      </form>
    );
  }
}

PlayerSelection.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  username: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
