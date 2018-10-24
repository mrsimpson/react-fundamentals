export default class GithubApi {
  static async get(url, params = {}) {
    params.method = 'GET';
    if (process.env.GITHUB_API_KEY) {
      params.headers = { Authorization: `token ${process.env.GITHUB_API_KEY}` };
    }
    return fetch(url, params);
  }

  static async fetchPopularRepos(language) {
    const url = encodeURI(`https://api.github.com/search/repositories?q=stars:>1 language:${language}&sort=stars&order=desc`);
    const response = await fetch(url);
    return response.json();
  }

  static async getUserAvatarUrl(username) {
    const url = encodeURI(`https://api.github.com/users/${username}`);
    const response = await GithubApi.get(url);
    const profile = await response.json();
    return `${profile.avatar_url}?size=200`;
  }

  static async isUsernameValid(username) {
    const url = encodeURI(`https://api.github.com/users/${username}`);
    const response = await GithubApi.get(url);
    return response.ok;
  }
}
