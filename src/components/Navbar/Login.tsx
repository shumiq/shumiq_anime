import GoogleLogin, {
  GoogleLogout,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import React, { useState } from 'react';
import { Auth } from '../../services/Firebase/Firebase';
import UserDetail from '../../services/UserDetail/UserDetail';
import { User } from '../../models/Type';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch } from 'react-redux';
import { Action } from '../../utils/Store/AppStore';
import storage from '../../utils/LocalStorage/LocalStorage';

const Login = (): JSX.Element => {
  const [user, setUser] = useState<User>({});

  const dispatch = useDispatch();

  const login = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ): void => {
    const user = (response as GoogleLoginResponse).profileObj as User;
    storage.set(
      'user',
      JSON.stringify((response as GoogleLoginResponse).profileObj)
    );
    storage.set('accessToken', (response as GoogleLoginResponse).accessToken);
    dispatch(Action.signIn(user));
    setUser(UserDetail.getUser() || {});
    Auth.signIn((response as GoogleLoginResponse).tokenId);
  };

  const logout = () => {
    storage.remove('user');
    storage.remove('accessToken');
    dispatch(Action.signOut());
    setUser(UserDetail.getUser() || {});
    Auth.signOut();
  };

  return (
    <div className="Login">
      {JSON.stringify(user) === '{}' && (
        <GoogleLogin
          clientId="557663136777-f5pcv9r46pipto60jqmepd6btmmlp86f.apps.googleusercontent.com"
          onSuccess={login}
          onFailure={logout}
          scope="profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/youtube.readonly"
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
