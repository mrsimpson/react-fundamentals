import React from 'react';
import { render } from 'react-dom';
import { App } from './components/App';
require('./index.css');

render(
    <App name='Dummy'/>,
    document.getElementById('app'),
);
