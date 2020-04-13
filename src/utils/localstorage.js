const STORAGE_KEY = 'MYAPP';

export const setLocalStorage = (key, value) => {
  window.localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
};

export function getLocalStorage(key) {
  const value = window.localStorage.getItem(`${STORAGE_KEY}_${key}`);

  try {
    return JSON.parse(value) || {};
  } catch (err) {
    console.error(err);
    return {};
  }
}

export const removeLocalStorage = key => {
  window.localStorage.removeItem(`${STORAGE_KEY}_${key}`);
};
