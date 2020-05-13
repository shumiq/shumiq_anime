import { getLocalStorage } from './localstorage';
import { getUser, IsAdmin, getAccessToken } from './userDetail';

jest.mock('./localstorage');

describe('UserDetail', () => {

    it('should return user if has user', () => {
        getLocalStorage.mockReturnValue({ email: 'test_user' });
        const user = getUser();
        expect(user.email).toBe('test_user');
    });

    it('should return null user if not has user', () => {
        getLocalStorage.mockReturnValue(null);
        const user = getUser();
        expect(user).toBe(null);
    });

    it('should return access token if has', () => {
        getLocalStorage.mockReturnValue('access_token');
        expect(getAccessToken()).toBe('access_token');
    });

    it('should return null access token if not has', () => {
        getLocalStorage.mockReturnValue('');
        expect(getAccessToken()).toBe(null);
    });

    it('should be admin if email is iq.at.sk131@gmail.com', () => {
        getLocalStorage.mockReturnValue({ email: 'iq.at.sk131@gmail.com' });
        expect(IsAdmin()).toBe(true);
    });

    it('should not be admin if email not iq.at.sk131@gmail.com', () => {
        getLocalStorage.mockReturnValue({ email: 'iq.at.sk131asfgas@gmail.com' });
        expect(IsAdmin()).toBe(false);
    });
});