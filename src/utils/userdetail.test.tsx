import { getLocalStorage } from './localstorage';
import UserDetail from './userdetail';

jest.mock('./localstorage');

describe('userdetail', () => {
  it('should return user if has user', () => {
    (getLocalStorage as jest.Mock).mockReturnValue({ email: 'test_user' });
    const user = UserDetail.getUser();
    expect(user?.email).toBe('test_user');
  });

  it('should return null user if not has user', () => {
    (getLocalStorage as jest.Mock).mockReturnValue(null);
    const user = UserDetail.getUser();
    expect(user).toBe(null);
  });

  it('should return access token if has', () => {
    (getLocalStorage as jest.Mock).mockReturnValue('access_token');
    expect(UserDetail.getAccessToken()).toBe('access_token');
  });

  it('should return null access token if not has', () => {
    (getLocalStorage as jest.Mock).mockReturnValue('');
    expect(UserDetail.getAccessToken()).toBe('');
  });

  it('should be admin if email is iq.at.sk131@gmail.com', () => {
    (getLocalStorage as jest.Mock).mockReturnValue({
      email: 'iq.at.sk131@gmail.com',
    });
    expect(UserDetail.isAdmin()).toBe(true);
  });

  it('should not be admin if email not iq.at.sk131@gmail.com', () => {
    (getLocalStorage as jest.Mock).mockReturnValue({
      email: 'iq.at.sk131asfgas@gmail.com',
    });
    expect(UserDetail.isAdmin()).toBe(false);
  });
});
