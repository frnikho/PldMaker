
export const weeksDay = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const months = ['janvier', 'fevrier', 'mars', 'avril', 'may', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

/**
 * Format long date format like '?'
 * @param date
 */
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString("fr");
}

/**
 * Format long date format like '22/10/2000 à 8h45'
 * @param date
 */
export const formatLongDate = (date: Date): string => {
  return date.toLocaleDateString("fr") + " à " + date.toLocaleTimeString("fr");
}

/**
 * Format long date format like '22 septembre 2022'
 * @param date
 */
export const formatAllDayEventDate = (date: Date): string => {
  return date.toLocaleDateString("fr", {day: '2-digit', month: 'long', year: 'numeric'});
}

/**
 * Format long date format like '22 septembre 2022'
 * @param date
 */
export const formatLongDayEventDate = (date: Date): string => {
  return date.toLocaleDateString("fr", {day: '2-digit', month: 'long', year: 'numeric'}) + ' à ' + date.toLocaleTimeString("fr");
}

/**
 * Format numeric date like '22/10/2000'
 * @param date
 */
export const formatDateNumeric = (date: Date): string => {
  return date.toLocaleString('fr', { day: 'numeric', month: 'long', year: 'numeric'})
}

export const formatDateCharts = (date: Date) => {
  if (date.getMonth() + 1 < 10)
    return date.getFullYear() + '-' + '0' + (date.getMonth() + 1) + '-' + date.getDate();
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export const formatDateHistory = (date: Date) => {
  return date.toLocaleTimeString("fr") + ' ' + date.toLocaleDateString("fr");
}

export const isSameDate = (d1: Date, d2: Date) => {
  return d1.getDate() === d2.getDate() && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}
