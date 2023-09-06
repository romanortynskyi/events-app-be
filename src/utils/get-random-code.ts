import { getRandomIntInRange } from './get-random-int-in-range';

export const getRandomCode = (length: number): string => {
  const digits = [];

  for (let i = 0; i < length; i++) {
    digits.push(getRandomIntInRange(0, 9));
  }

  return digits.join('');
};
