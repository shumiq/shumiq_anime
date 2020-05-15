import React, { useState } from 'react';
import Login from '../Login/Login';
import history from '../../history';
import { IsAdmin } from '../../utils/userdetail';
import { onFirebaseAuthUpdate } from '../../utils/firebase';
import { getLocalStorage, setLocalStorage } from '../../utils/localstorage';

const Navbar = () => {
    const [isAnime, setIsAnime] = useState(history.location.pathname === '/' || history.location.pathname === '/sync');
    const [isAdmin, setIsAdmin] = useState(IsAdmin());
    const [cardLayout, setCardLayout] = useState(JSON.stringify(getLocalStorage('layout')) !== '{}' ? getLocalStorage('layout') : 'auto');

    onFirebaseAuthUpdate(() => {
        setIsAdmin(IsAdmin());
    });

    const updateCardLayout = () => {
        let nextLayout = 'auto';
        if (cardLayout === 'auto') nextLayout = 'small';
        if (cardLayout === 'small') nextLayout = 'medium';
        if (cardLayout === 'medium') nextLayout = 'large';
        if (cardLayout === 'large') nextLayout = 'auto';
        setCardLayout(nextLayout)
        setLocalStorage('layout', nextLayout);
    }

    return (
        <div className="navbar">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <a id='link-logo' className="navbar-brand" href="/">MyAnimeList</a>
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
                            <a id='link-anime' className="nav-link btn" href="/" onClick={() => setIsAnime(true)}>Anime</a>
                        </li>
                        {isAnime && isAdmin &&
                            <li className="nav-item">
                                <a id='link-sync' className="nav-link btn" href="/sync" onClick={() => setIsAnime(true)}>Sync Anime</a>
                            </li>
                        }
                        <li className="nav-item">
                            <a id='link-conan' className="nav-link btn" href="/conan" onClick={() => setIsAnime(false)}>Conan</a>
                        </li>
                        <li className="nav-item">
                            <a id='link-keyaki' className="nav-link btn" href="/keyaki" onClick={() => setIsAnime(false)}>Keyakitte Kakenai</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav text-center ml-auto">
                        <li className="nav-item">
                            <p id='btn-layout' className="nav-link btn m-0" onClick={updateCardLayout}>{cardLayout}</p>
                        </li>
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
