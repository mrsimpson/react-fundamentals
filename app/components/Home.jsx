import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <div className="header">Battle GitHub users - and other stuff!</div>
      <Link className="button" to="/battle">Get ready to rumble!</Link>
    </div>
  );
}
