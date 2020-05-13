import { getLocalStorage } from './localstorage';

export const getUser = () => {
    let user = getLocalStorage('user');
    if (user?.email) return user;
    return null;
};

export const getAccessToken = () => {
    let accessToken = getLocalStorage('accessToken');
    if (accessToken !== '') return accessToken;
    return null;
};

export const IsAdmin = () => {
    if (getUser()?.email === "iq.at.sk131@gmail.com") return true;
    return false;
};