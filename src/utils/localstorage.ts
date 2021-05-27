const STORAGE_KEY = 'shumiq_anime';

export const setLocalStorage = (key: string, value: unknown): void => {
  window.localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
};

export const getLocalStorage = (key: string): unknown => {
  const value = window.localStorage.getItem(`${STORAGE_KEY}_${key}`) || '';

  try {
    return (JSON.parse(value) as unknown) || {};
  } catch (err) {
    return {};
  }
};

export const removeLocalStorage = (key: string): void => {
  window.localStorage.removeItem(`${STORAGE_KEY}_${key}`);
};

export const storage = {
  set : (key: string, value: string): void => {
    window.localStorage.setItem(`${STORAGE_KEY}_${key}`, value);
  },
  get : (key: string): string | null => {
    return window.localStorage.getItem(`${STORAGE_KEY}_${key}`);
  }
};