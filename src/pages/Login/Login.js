import React from 'react';
import history from '../../history';
import GoogleLogin from 'react-google-login';
import { setLocalStorage } from '../../utils/localstorage';

const GoogleResponse = response => {
    setLocalStorage('user', response.profileObj);
    setLocalStorage('accessToken', response.accessToken);
    history.push('/');
};

const Login = () => {
    return (
        <GoogleLogin
            clientId="767269916888-tnoirdka5n3clh9no037rn5svl4d34n3.apps.googleusercontent.com"
            onSuccess={GoogleResponse}
            scope="profile email https://www.googleapis.com/auth/photoslibrary"
            isSignedIn={true}
        />
    );
};

export default Login;
