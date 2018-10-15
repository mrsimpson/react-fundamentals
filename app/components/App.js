import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Popular } from './Popular';

export class App extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired
    };

    render() {
        return (
            <div className='container'>
                <Popular />
            </div>
        );
    }
}