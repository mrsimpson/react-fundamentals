import React, { Component } from 'react';
import qs from 'qs';
import Loader from './Loader';
import GithubApi from '../utils/GithubApi';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      isLoading: true,
    };

    this.api = new GithubApi();

    this.setResult = this.setResult.bind(this);
  }

  async componentDidMount() {
    const { location } = this.props;
    const { search } = location;
    const queryParams = qs.parse(search, { ignoreQueryPrefix: true });

    const result = await this.api.battle([queryParams.playerOne, queryParams.playerTwo]);
    this.setResult(result);
  }

  setResult(result) {
    this.setState({
      result,
      isLoading: false,
    });
  }

  render() {
    const { playerOneUsername, playerTwoUsername, isLoading } = this.state;

    return (
      isLoading
        ? <Loader />
        : <div className="row">{JSON.stringify(this.state.result, null, 2)}</div>
    );
  }
}
