/* eslint class-methods-use-this: off */

import parseLinkHeader from 'parse-link-header';

async function get(url, parameters = {}) {
  const params = parameters;
  params.method = 'GET';
  if (process.env.GITHUB_API_KEY) {
    params.headers = { Authorization: `token ${process.env.GITHUB_API_KEY}` };
  }
  return fetch(url, params);
}

async function getProfile(username) {
  const url = encodeURI(`https://api.github.com/users/${username}`);
  const response = await get(url);
  if (!response.ok) {
    throw new Error(`could not get profile for ${username}`);
  }
  const profile = await response.json();
  return profile;
}

async function fetchPagedRepos(baseUrl, pages) {
  const urls = [];
  for (let i = 1; i <= pages; i++) {
    urls.push(`${baseUrl}?page=${i}`);
  }
  const repoPageReponses = await Promise.all(urls.map(async url => get(url)));
  const repoPages = await Promise.all(repoPageReponses.map(
    repoPageReponse => repoPageReponse.json()
  ));
  return [].concat(...repoPages);
}

async function getUsersRepositories(username) {
  const url = encodeURI(`https://api.github.com/users/${username}/repos`);
  const response = await get(url);
  if (!response.ok) {
    throw new Error(`could not get repositories for ${username}`);
  }
  let repos = [];
  const linkHeader = parseLinkHeader(response.headers.get('Link'));
  if (linkHeader && linkHeader.last && linkHeader.last.page) {
    repos = await fetchPagedRepos(url, linkHeader.last.page);
  } else {
    repos = await response.json();
  }
  return repos;
}

function getTotalStars(repos) {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

export default class GithubApi {
  async fetchPopularRepos(language) {
    const url = encodeURI(`https://api.github.com/search/repositories?q=stars:>1 language:${language}&sort=stars&order=desc`);
    const response = await fetch(url);
    return response.json();
  }

  async getUserAvatarUrl(username) {
    const profile = await getProfile(username);
    return profile.avatar_url;
  }

  async isUsernameValid(username) {
    try {
      await getProfile(username);
      return true;
    } catch (e) {
      return false;
    }
  }

  async battle(usernames) {
    const players = await Promise.all(usernames.map(async (username) => {
      const profile = await getProfile(username);
      const repos = await getUsersRepositories(username);
      const totalStars = getTotalStars(repos);
      return {
        profile,
        totalStars,
        totalScore: profile.followers * 3 + totalStars
      };
    }));
    return players.sort((a, b) => a.totalScore < b.totalScore);
  }
}
