import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  public_repos,
}) {
  return {
    Company: company,
    Location: location,
    Followers: followers,
    'Public Repos': public_repos,
    Blog: blog,
  };
}

function PlayerScore({ result, label }) {
  const { profile, totalScore } = result;
  return (
    <div>
      <h1 className="header">{label}</h1>
      <PlayerFactsheet
        username={profile.login}
        avatarUrl={profile.avatar_url}
      >
        <div>{profile.name}</div>
        <h2 className="header">{`Score: ${totalScore}`}</h2>
        <ObjectFactsheetList o={getFactsheetProps(profile)} />
      </PlayerFactsheet>
    </div>
  );
}

PlayerScore.propTypes = {
  label: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired,
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
      );
  }
}

/*
{ "profile": { "login": "b", "id": 31712, "node_id": "MDQ6VXNlcjMxNzEy", "avatar_url": "https://avatars2.githubusercontent.com/u/31712?v=4", "gravatar_id": "", "url": "https://api.github.com/users/b", "html_url": "https://github.com/b", "followers_url": "https://api.github.com/users/b/followers", "following_url": "https://api.github.com/users/b/following{/other_user}", "gists_url": "https://api.github.com/users/b/gists{/gist_id}", "starred_url": "https://api.github.com/users/b/starred{/owner}{/repo}", "subscriptions_url": "https://api.github.com/users/b/subscriptions", "organizations_url": "https://api.github.com/users/b/orgs", "repos_url": "https://api.github.com/users/b/repos", "events_url": "https://api.github.com/users/b/events{/privacy}", "received_events_url": "https://api.github.com/users/b/received_events", "type": "User", "site_admin": false, "name": "Benjamin Black", "company": null, "blog": "http://blog.b3k.us", "location": "Seattle, WA", "email": "b@b3k.us", "hireable": null, "bio": null, "public_repos": 94, "public_gists": 10, "followers": 158, "following": 2, "created_at": "2008-10-29T21:00:03Z", "updated_at": "2018-07-24T19:28:00Z" }, "totalStars": 631, "totalScore": 1105 }
*/
