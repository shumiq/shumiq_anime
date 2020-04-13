import { getLocalStorage } from './localstorage';
import history from '../history';

export const getUser = () => {
    let user = getLocalStorage('user');
    if (user?.email) return user;
    history.push('/login');
};

export const getAccessToken = () => {
    let accessToken = getLocalStorage('accessToken');
    if (accessToken !== '') return accessToken;
    history.push('/login');
};
