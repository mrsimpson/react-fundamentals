import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import qs from 'qs';
import Loader from './Loader';
import GithubApi from '../utils/GithubApi';
import { PlayerFactsheet } from './Player';
import { ObjectFactsheetList } from './ObjectFactsheet';

function getFactsheetProps({
  blog,
  company,
  followers,
  location,
  public_repos: publicRepos,
}) {
  return {
    Company: company,
    Location: location,
    Followers: followers,
    'Public Repos': publicRepos,
    Blog: blog,
  };
}

const propTypeProfile = PropTypes.shape({
  blog: PropTypes.string.isRequired,
  company: PropTypes.string,
  followers: PropTypes.number.isRequired,
  location: PropTypes.string,
  public_repos: PropTypes.number.isRequired,
});

function PlayerScore({ result, label }) {
  const { profile, totalScore } = result;
  const { name, login, avatar_url: avatarUrl } = profile;
  return (
    <div>
      <h1 className="header">{label}</h1>
      <PlayerFactsheet
        username={login}
        avatarUrl={avatarUrl}
      >
        <div>{name}</div>
        <h2 className="header">{`Score: ${totalScore}`}</h2>
        <ObjectFactsheetList o={getFactsheetProps(profile)} />
      </PlayerFactsheet>
    </div>
  );
}

PlayerScore.propTypes = {
  label: PropTypes.string.isRequired,
  result: PropTypes.shape({
    profile: propTypeProfile.isRequired,
    totalScore: PropTypes.number.isRequired,
    totalStars: PropTypes.number.isRequired,
  }).isRequired,
};

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      isLoading: true,
    };

    this.api = new GithubApi();

    this.setResult = this.setResult.bind(this);
    this.setError = this.setError.bind(this);
  }

  async componentDidMount() {
    const { location } = this.props;
    const { search } = location;
    const queryParams = qs.parse(search, { ignoreQueryPrefix: true });

    try {
      const result = await this.api.battle([queryParams.playerOne, queryParams.playerTwo]);
      this.setResult(result);
    } catch (e) {
      this.setError(e);
    }
  }

  setResult(result) {
    this.setState({
      winner: result[0],
      loser: result[1],
      error: null,
      isLoading: false,
    });
  }

  setError(error) {
    this.setState({
      error,
      isLoading: false,
    });
  }

  render() {
    const {
      winner, loser, error, isLoading
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }
    return error
      ? <div>Something went wrong - check usernames</div>
      : (
        <div className="battle-result content">
          <div className="column">
            <div className="row">
              <div className="column winner">
                <PlayerScore
                  label="Winner"
                  result={winner}
                />
              </div>
              <div className="column loser">
                <PlayerScore
                  label="Loser"
                  result={loser}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <Link
              className="button"
              to="/battle"
            >
                          Reset
            </Link>
          </div>
        </div>
      );
  }
}
