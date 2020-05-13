import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localstorage';

describe('LocalStorage', () => {

    it('should return correct value', () => {
        setLocalStorage('test_key', { key: 'value' })
        const value = getLocalStorage('test_key');
        expect(value).toStrictEqual({ key: 'value' });
    });

    it('should return {} if no key', () => {
        const value = getLocalStorage('non_existed_key');
        expect(value).toStrictEqual({});
    });

    it('should return {} after remove key', () => {
        setLocalStorage('test_key', { key: 'value' });
        removeLocalStorage('test_key');
        const value = getLocalStorage('test_key');
        expect(value).toStrictEqual({});
    });
});