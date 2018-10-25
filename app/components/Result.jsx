import React, { Component } from 'react';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerOneUsername: '',
      playerTwoUsername: '',
      isLoading: true
    };
  }

  render() {
    return (
      <div className="row">{JSON.stringify(this.props, null, 2)}</div>
    );
  }
}
