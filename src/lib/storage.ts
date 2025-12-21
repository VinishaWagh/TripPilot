export const saveQueryLocal = (query: string) => {
  try {
    const key = 'skyport_queries';
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ query, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save local query', err);
  }
};

export const getSavedQueriesLocal = () => {
  try {
    const raw = localStorage.getItem('skyport_queries');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};
