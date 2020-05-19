import { setLocalStorage, removeLocalStorage } from '../../utils/localstorage';
import { SignIn, SignOut } from '../../utils/firebase';
import { getUser } from '../../utils/userdetail';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import React, { useState } from 'react';

const Login = () => {
  const [user, setUser] = useState(null);

  const login = (response) => {
    setLocalStorage('user', response.profileObj);
    setLocalStorage('accessToken', response.accessToken);
    setUser(getUser());
    SignIn(response.tokenId);
  };

  const logout = (response) => {
    removeLocalStorage('user');
    removeLocalStorage('accessToken');
    setUser(getUser());
    SignOut();
  };

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
              {getUser() && (
                <img
                  src={getUser().imageUrl}
                  alt={getUser().name}
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px' }}
                />
              )}
              {!getUser() && <b>Login</b>}
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
