import Login from '../Login/Login';
import history from '../../history';
import { IsAdmin } from '../../utils/userdetail';
import { onFirebaseAuthUpdate } from '../../utils/firebase';
import { getLocalStorage, setLocalStorage } from '../../utils/localstorage';
import AddAnimePopup from '../Popup/AddAnimePopup';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isAnime, setIsAnime] = useState(
    history.location.pathname === '/' || history.location.pathname === '/sync'
  );
  const [isAdmin, setIsAdmin] = useState(IsAdmin());
  const [popup, setPopup] = useState('');
  const [cardLayout, setCardLayout] = useState(
    JSON.stringify(getLocalStorage('layout')) !== '{}'
      ? getLocalStorage('layout')
      : 'auto'
  );

  useEffect(() => {
    onFirebaseAuthUpdate(() => {
      setIsAdmin(IsAdmin());
    });
  }, []);

  const updateCardLayout = useCallback(() => {
    let nextLayout = 'auto';
    if (cardLayout === 'auto') nextLayout = 'small';
    if (cardLayout === 'small') nextLayout = 'medium';
    if (cardLayout === 'medium') nextLayout = 'large';
    if (cardLayout === 'large') nextLayout = 'auto';
    setCardLayout(nextLayout);
    setLocalStorage('layout', nextLayout);
  }, [cardLayout]);

  const showAddAnime = useCallback(() => {
    const showAddAnimePopup = (show) => {
      setPopup(<AddAnimePopup show={show} setShow={showAddAnimePopup} />);
    };
    showAddAnimePopup(true);
    setIsAnime(true);
  }, []);

  return (
    <div className="navbar">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <a id="link-logo" className="navbar-brand" href="/">
          MyAnimeList
        </a>
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
              <Link
                id="link-anime"
                className="nav-link btn"
                to="/"
                onClick={() => setIsAnime(true)}
              >
                Anime
              </Link>
            </li>
            {isAnime && isAdmin && (
              <li className="nav-item">
                <Link
                  id="link-add"
                  className="nav-link btn"
                  to="/"
                  onClick={showAddAnime}
                >
                  Add Anime
                </Link>
              </li>
            )}
            {isAnime && isAdmin && (
              <li className="nav-item">
                <Link
                  id="link-sync"
                  className="nav-link btn"
                  to="/sync"
                  onClick={() => setIsAnime(true)}
                >
                  Sync Anime
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                id="link-conan"
                className="nav-link btn"
                to="/conan"
                onClick={() => setIsAnime(false)}
              >
                Conan
              </Link>
            </li>
            <li className="nav-item">
              <Link
                id="link-keyaki"
                className="nav-link btn"
                to="/keyaki"
                onClick={() => setIsAnime(false)}
              >
                Keyakitte Kakenai
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav text-center ml-auto">
            {isAnime && (
              <li className="nav-item">
                <p
                  id="btn-layout"
                  className="nav-link btn m-0"
                  onClick={updateCardLayout}
                >
                  {cardLayout}
                </p>
              </li>
            )}
            <li className="nav-item">
              <Login />
            </li>
          </ul>
        </div>
      </nav>
      {popup}
    </div>
  );
};

export default Navbar;
