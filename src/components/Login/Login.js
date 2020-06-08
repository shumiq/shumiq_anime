import GoogleLogin, { GoogleLogout } from 'react-google-login';
import React, { useState, useCallback } from 'react';
import { setLocalStorage, removeLocalStorage } from '../../utils/localstorage';
import { Auth } from '../../utils/firebase';
import UserDetail from '../../utils/userdetail';

const Login = () => {
  const [user, setUser] = useState(null);

  const login = useCallback((response) => {
    setLocalStorage('user', response.profileObj);
    setLocalStorage('accessToken', response.accessToken);
    setUser(UserDetail.getUser());
    Auth.signIn(response.tokenId);
  }, []);

  const logout = useCallback((response) => {
    removeLocalStorage('user');
    removeLocalStorage('accessToken');
    setUser(UserDetail.getUser());
    Auth.signOut();
  }, []);

  return (
    <div className="Login">
      {user == null && (
        <GoogleLogin
          clientId="557663136777-f5pcv9r46pipto60jqmepd6btmmlp86f.apps.googleusercontent.com"
          onSuccess={login}
          scope="profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/photoslibrary.readonly"
          isSignedIn={true}
          render={(renderProps) => (
            <button
              className="btn"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              {UserDetail.getUser() && (
                <img
                  src={UserDetail.getUser().imageUrl}
                  alt={UserDetail.getUser().name}
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px' }}
                />
              )}
              {!UserDetail.getUser() && <b>Login</b>}
            </button>
          )}
        />
      )}
      {user != null && (
        <GoogleLogout
          clientId="557663136777-f5pcv9r46pipto60jqmepd6btmmlp86f.apps.googleusercontent.com"
          onLogoutSuccess={logout}
          render={(renderProps) => (
            <button
              className="btn"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img
                src={user.imageUrl}
                alt={user.name}
                className="rounded-circle"
                style={{ width: '30px', height: '30px' }}
              />
            </button>
          )}
        ></GoogleLogout>
      )}
    </div>
  );
};

export default Login;
