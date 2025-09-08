// localStorageUtils.js

export const getLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const addToStorage = (key, item) => {
  const existing = getLocalStorage(key);
  const isDuplicate = existing.some((i) => i._id === item._id);

  if (!isDuplicate) {
    const updated = [...existing, item];
    setLocalStorage(key, updated);
  }
};
