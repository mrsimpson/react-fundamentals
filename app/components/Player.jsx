import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import GithubApi from '../utils/GithubApi';

export default class Player extends Component {
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
    this.debounceValidateUsername = _.debounce(this.validateUsername, 300);
  }

  validateUsername() {
    this.state.username
    && GithubApi.isUsernameValid(this.state.username)
      .then(isValid => this.setState({ isValid }))
      .catch(() => this.setState({ isValid: false }));
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
    return (
      <form className="column player" onSubmit={this.handleSubmit}>
        <label className="header" htmlFor="username">{this.state.label}</label>
        <input id="username" placeholder="username" className={!this.state.isValid && this.state.username ? 'error' : ''} value={this.state.username} autoComplete="off" onChange={this.handleUsernameChange} />
        <button type="submit" className="button" disabled={!this.state.isValid}>
          Submit
        </button>
      </form>
    );
  }
}

Player.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  username: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
