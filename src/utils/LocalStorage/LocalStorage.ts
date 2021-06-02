const STORAGE_KEY = 'shumiq_anime';

export default {
  set: (key: string, value: string): void => {
    window.localStorage.setItem(`${STORAGE_KEY}_${key}`, value);
  },
  get: (key: string): string | null => {
    return window.localStorage.getItem(`${STORAGE_KEY}_${key}`);
  },
  remove: (key: string): void => {
    window.localStorage.removeItem(`${STORAGE_KEY}_${key}`);
  },
};
