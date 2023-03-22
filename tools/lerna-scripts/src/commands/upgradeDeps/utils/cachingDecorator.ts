function cachingDecorator<K, T>(func: (args: K) => T): (args: K) => T {
  const cache = new Map<K, T>();

  return (x: K): T => {
    if (cache.has(x)) {
      return cache.get(x) as T;
    }

    const result = func(x);

    cache.set(x, result);
    return result;
  };
}

export default cachingDecorator;
