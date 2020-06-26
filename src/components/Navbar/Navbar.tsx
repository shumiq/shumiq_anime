import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import history from '../../history';
import UserDetail from '../../utils/userdetail';
import { Auth } from '../../utils/firebase';
import { getLocalStorage, setLocalStorage } from '../../utils/localstorage';
import AddAnimePopup from '../Popup/AddAnimePopup';

const Navbar = (): JSX.Element => {
  const [isAnime, setIsAnime] = useState<boolean>(
    history.location.pathname === '/' || history.location.pathname === '/sync'
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(UserDetail.isAdmin());
  const [popup, setPopup] = useState<string | JSX.Element>('');
  const [cardLayout, setCardLayout] = useState<string>(
    JSON.stringify(getLocalStorage('layout')) !== '{}'
      ? (getLocalStorage('layout') as string)
      : 'auto'
  );

  useEffect(() => {
    Auth.subscribe(() => {
      setIsAdmin(UserDetail.isAdmin());
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
    const showAddAnimePopup = (show: boolean) => {
      setPopup(<AddAnimePopup show={show} onClose={() => setPopup('')} />);
    };
    showAddAnimePopup(true);
    setIsAnime(true);
  }, []);

  return (
    <div className="Navbarasfasf">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
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
            <span className="navbar-toggler-icon"></span>
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
                    className="nav-link btn w-100"
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
              {isAdmin && (
                <li className="nav-item">
                  <Link
                    id="link-backup"
                    className="nav-link btn"
                    to="/backup"
                    onClick={() => setIsAnime(false)}
                  >
                    Backup
                  </Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav text-center ml-auto">
              {isAnime && (
                <li className="nav-item">
                  <p
                    id="btn-layout"
                    className="nav-link btn m-0"
                    onClick={updateCardLayout}
                  >
                    {cardLayout === 'small' ? (
                      <i className="material-icons">photo_size_select_small</i>
                    ) : cardLayout === 'medium' ? (
                      <i className="material-icons">photo_size_select_large</i>
                    ) : cardLayout === 'large' ? (
                      <i className="material-icons">photo_size_select_actual</i>
                    ) : (
                      <i className="material-icons">brightness_auto</i>
                    )}
                  </p>
                </li>
              )}
              <li className="nav-item">
                <Login />
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {popup}
    </div>
  );
};

export default Navbar;
