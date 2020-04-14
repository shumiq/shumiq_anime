import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <a className="navbar-brand" href="index.html">MyAnimeList</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav text-center mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/">Anime</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/conan">Conan</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/keyaki">Keyakitte Kakenai</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav text-center ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/login">Login</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
