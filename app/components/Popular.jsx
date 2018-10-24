import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import GithubApi from '../utils/GithubApi';

function SelectLanguage({ activeLanguage, onSelect }) {
  const languages = ['All', 'Javascript', 'ABAP', 'Java', 'Ruby', 'CSS', 'Python'];

  return (
    <ul className="languages">
      {languages.map(language => (
        <li key={language}>
          <Link
            to={`#${language}`}
            onClick={onSelect.bind(null, language)}
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

    // Make sure all state modifying functions access the proper THIS context
    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateRepos = this.updateRepos.bind(this);
  }

  async componentDidMount() {
    await this.updateLanguage(this.state.activeLanguage);
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

    const response = await GithubApi.fetchPopularRepos(language);
    this.updateRepos(response.items || []);
  }

  render() {
    return (
      <div>
        <SelectLanguage activeLanguage={this.state.activeLanguage} onSelect={this.updateLanguage} />
        {this.state.reposLoaded
          ? <ReposGrid repos={this.state.repos} />
          : <p>LOADING</p>
        }
      </div>
    );
  }
}