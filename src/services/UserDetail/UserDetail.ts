import { getLocalStorage } from '../../utils/LocalStorage/LocalStorage';
import { User } from '../../models/Type';

export default {
  getUser: (): User | null => {
    const user = getLocalStorage('user') as User;
    if (user?.email) return user;
    return null;
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