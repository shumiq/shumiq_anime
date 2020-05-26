import { getLocalStorage } from './localstorage';

export default {
  getUser: () => {
    let user = getLocalStorage('user');
    if (user?.email) return user;
    return null;
  },
  getAccessToken: () => {
    let accessToken = getLocalStorage('accessToken');
    if (accessToken !== '') return accessToken;
    return null;
  },
  isAdmin: () => {
    if (getLocalStorage('user')?.email === 'iq.at.sk131@gmail.com') return true;
    return false;
  },
};
