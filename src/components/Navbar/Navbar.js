import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import history from '../../history';
import { IsAdmin } from '../../utils/userDetail';
import { onFirebaseAuthUpdate } from '../../utils/firebase';

const Navbar = () => {
    const [isAnime, setIsAnime] = useState(history.location.pathname === '/' || history.location.pathname === '/sync');
    const [isAdmin, setIsAdmin] = useState(false);

    onFirebaseAuthUpdate(() => {
        setIsAdmin(IsAdmin());
    });

    return (
        <div className="navbar">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <a className="navbar-brand" href="/">MyAnimeList</a>
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
                            <Link className="nav-link btn" to="/" onClick={() => setIsAnime(true)}>Anime</Link>
                        </li>
                        {isAnime && isAdmin &&
                            <li className="nav-item">
                                <Link className="nav-link btn" to="/sync" onClick={() => setIsAnime(true)}>Sync Anime</Link>
                            </li>
                        }
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/conan" onClick={() => setIsAnime(false)}>Conan</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/keyaki" onClick={() => setIsAnime(false)}>Keyakitte Kakenai</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav text-center ml-auto">
                        <li className="nav-item">
                            <Login />
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
