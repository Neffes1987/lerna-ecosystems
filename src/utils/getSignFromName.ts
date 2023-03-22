export const getSignFromName = (name: string): string => {
  return name
    .split(' ')
    .map((str) => {
      return str ? str[0].toUpperCase() : '';
    })
    .join('');
};
