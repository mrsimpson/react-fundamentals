import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Popular from './Popular';
import Nav from './Nav';
import Home from './Home';
import Battle from './Battle';

export default function App() {
  return (
    <Router>

      <div className="container">
        <Nav />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/battle" component={Battle} />
          <Route path="/popular" component={Popular} />
          <Route component={() => (<div>consider this 404</div>)
          }
          />
        </Switch>
      </div>
    </Router>

  );
}
