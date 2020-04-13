import React from 'react';
import {Link} from 'react-router-dom';

class Navbar extends React.PureComponent {
  render () {
    return (
      <div className="navbar">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <a class="navbar-brand" href="index.html">MyAnimeList</a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav text-center mr-auto">
              <li class="nav-item">
                <Link class="nav-link btn" to="/">Anime</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link btn" to="/conan">Conan</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link btn" to="/keyaki">Keyakitte Kakenai</Link>
              </li>
            </ul>
            <ul class="navbar-nav text-center ml-auto">
              <li class="nav-item">
                <Link class="nav-link btn" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
