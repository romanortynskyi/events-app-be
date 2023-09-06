export const getObjectWithoutKeys = <T>(object: T, keys: string[]): T => {
  const entries = Object.entries(object);

  const entriesWithoutKeys = entries.filter(([key]) => !keys.includes(key));

  return Object.fromEntries(entriesWithoutKeys) as T;
};
