function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

/**
 * Format date to string 'mm/dd/yyyy'
 * @param date
 */
export const formatDateNumeric = (date?: Date): string => {
  if (date === undefined)
    return '';
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join('/');
}
