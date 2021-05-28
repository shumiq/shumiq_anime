import GoogleLogin, {
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import React, { useState, useCallback } from 'react';
import {
  setLocalStorage,
  removeLocalStorage,
} from '../../utils/LocalStorage/LocalStorage';
import { Auth } from '../../services/Firebase/Firebase';
import UserDetail from '../../services/UserDetail/UserDetail';
import { User } from '../../models/Type';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar } from '@material-ui/core';

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
            <ListItem
              button
              key={'signIn'}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              {UserDetail.getUser() !== null && (
                <>
                  <ListItemIcon>
                    <Avatar
                      alt={UserDetail.getUser()?.name || ''}
                      src={UserDetail.getUser()?.imageUrl || ''}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={UserDetail.getUser()?.name || 'Anonymous'}
                  />
                </>
              )}
              {UserDetail.getUser() === null && (
                <>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Sign In'} />
                </>
              )}
            </ListItem>
          )}
        />
      )}
      {JSON.stringify(user) !== '{}' && (
        <GoogleLogout
          clientId="557663136777-f5pcv9r46pipto60jqmepd6btmmlp86f.apps.googleusercontent.com"
          onLogoutSuccess={logout}
          render={(renderProps) => (
            <ListItem
              button
              key={'signOut'}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <ListItemIcon>
                <Avatar
                  alt={UserDetail.getUser()?.name || ''}
                  src={UserDetail.getUser()?.imageUrl || ''}
                />
              </ListItemIcon>
              <ListItemText
                primary={UserDetail.getUser()?.name || 'Anonymous'}
              />
            </ListItem>
          )}
        />
      )}
    </div>
  );
};

export default Login;
