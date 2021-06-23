import storage from '../../utils/LocalStorage/LocalStorage';
import { User } from '../../models/Type';

const userDetail = {
  getUser: (): User | null => {
    const user = JSON.parse(storage.get('user') || '{}') as User;
    if (user?.email) return user;
    return null;
  },
  getAccessToken: (): string => {
    const accessToken = storage.get('access_token');
    return accessToken || '';
  },
  isAdmin: (): boolean => {
    return userDetail.getUser()?.email === 'iq.at.sk131@gmail.com';
  },
};

export default userDetail;
