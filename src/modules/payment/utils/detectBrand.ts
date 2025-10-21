export type CardBrand = 'VISA' | 'MASTERCARD';

export const detectBrand = (cardNumber: string): CardBrand | undefined => {
  const number = cardNumber.replace(/\s/g, '');

  if (number.startsWith('4')) {
    return 'VISA';
  }

  const mastercardPrefixes = [
    '51', '52', '53', '54', '55',
    '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229',
    '223', '224', '225', '226', '227', '228', '229',
    '23', '24', '25', '26', '27'
  ];

  for (const prefix of mastercardPrefixes) {
    if (number.startsWith(prefix)) {
      return 'MASTERCARD';
    }
  }

  return undefined;
};

export const luhnCheck = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(number) || number.length < 13 || number.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};