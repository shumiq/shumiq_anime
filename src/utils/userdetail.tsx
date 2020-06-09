import { getLocalStorage } from './localstorage';
import { User } from './types';

export default {
  getUser: (): User => {
    const user = getLocalStorage('user') as User;
    if (user?.email) return user;
    return {};
  },
  getAccessToken: (): string => {
    const accessToken = getLocalStorage('accessToken') as string;
    if (accessToken !== '') return accessToken;
    return '';
  },
  isAdmin: (): boolean => {
    if ((getLocalStorage('user') as User)?.email === 'iq.at.sk131@gmail.com')
      return true;
    return false;
  },
};
