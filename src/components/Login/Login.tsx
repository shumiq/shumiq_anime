import GoogleLogin, {
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import React, { useState, useCallback } from 'react';
import { setLocalStorage, removeLocalStorage } from '../../utils/localstorage';
import { Auth } from '../../utils/firebase';
import UserDetail from '../../utils/userdetail';
import { User } from '../../utils/types';

const Login = (): JSX.Element => {
  const [user, setUser] = useState<User>({});

  const login = useCallback(
    (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
      setLocalStorage('user', (response as GoogleLoginResponse).profileObj);
      setLocalStorage(
        'accessToken',
        (response as GoogleLoginResponse).accessToken
      );
      setUser(UserDetail.getUser() || {});
      Auth.signIn((response as GoogleLoginResponse).tokenId);
    },
    []
  );

  const logout = useCallback(() => {
    removeLocalStorage('user');
    removeLocalStorage('accessToken');
    setUser(UserDetail.getUser() || {});
    Auth.signOut();
  }, []);

  return (
    <div className="Login">
      {JSON.stringify(user) === '{}' && (
        <GoogleLogin
          clientId="557663136777-f5pcv9r46pipto60jqmepd6btmmlp86f.apps.googleusercontent.com"
          onSuccess={login}
          onFailure={logout}
          scope="profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/photoslibrary.readonly"
          isSignedIn={true}
          render={(renderProps) => (
            <button
              className="btn"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              {UserDetail.getUser() !== null && (
                <img
                  src={UserDetail.getUser()?.imageUrl || ''}
                  alt={UserDetail.getUser()?.name || ''}
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px' }}
                />
              )}
              {UserDetail.getUser() === null && <b>Login</b>}
            </button>
          )}
        />
      )}
      {JSON.stringify(user) !== '{}' && (
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
