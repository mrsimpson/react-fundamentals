import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import GithubApi from '../utils/GithubApi';
import Loader from './Loader';

function SelectLanguage({ activeLanguage, onSelect }) {
  const languages = ['All', 'Javascript', 'ABAP', 'Java', 'Ruby', 'CSS', 'Python'];

  function onClickLanguage(language) {
    return onSelect.bind(null, language);
  }

  return (
    <ul className="languages">
      {languages.map(language => (
        <li key={language}>
          <Link
            to={`#${language}`}
            onClick={onClickLanguage(language)}
            className={activeLanguage === language ? 'active' : 'inactive'}
          >
            {language}
          </Link>
        </li>))}
    </ul>
  );
}
SelectLanguage.propTypes = {
  activeLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

function RepoGridItem({ repo, index }) {
  return (
    <li className="repo-grid-item" key={repo.full_name}>
      <div className="rank">{`# ${index + 1}`}</div>
      <img
        className="avatar"
        src={repo.owner.avatar_url}
        alt={`Avatar of ${repo.owner.login}`}
      />
      <ul className="repo-factsheet">
        <li className="name"><a href={repo.html_url} target="blank">{repo.name}</a></li>
        <li className="owner">{`@${repo.owner.login}`}</li>
      </ul>
    </li>
  );
}
RepoGridItem.propTypes = {
  repo: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

function ReposGrid({ repos }) {
  return (
    <ul className="repos-grid">
      {repos.map((repo, index) => <RepoGridItem repo={repo} index={index} key={repo.full_name} />)}
    </ul>
  );
}
ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired,
};
export default class Popular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLanguage: 'All',
      reposLoaded: false,
      repos: []
    };

    this.api = new GithubApi();

    // Make sure all state modifying functions access the proper THIS context
    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateRepos = this.updateRepos.bind(this);
  }

  async componentDidMount() {
    const { activeLanguage } = this.state;
    await this.updateLanguage(activeLanguage);
  }

  updateRepos(repos) {
    this.setState({
      repos,
      reposLoaded: true
    });
  }

  async updateLanguage(language) {
    this.setState({
      activeLanguage: language,
      reposLoaded: false
    });

    const response = await this.api.fetchPopularRepos(language);
    this.updateRepos(response.items || []);
  }

  render() {
    const { activeLanguage, reposLoaded, repos } = this.state;

    return (
      <div>
        <SelectLanguage activeLanguage={activeLanguage} onSelect={this.updateLanguage} />
        {reposLoaded
          ? <ReposGrid repos={repos} />
          : <Loader />
        }
      </div>
    );
  }
}
