/* eslint class-methods-use-this: off */

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
    return usernames.reduce((result, username) => {
      result[username] = username;
      return result;
    }, {});
  }
}
