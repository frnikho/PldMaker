import { Deadline } from "./Deadline";
import { DateTime } from 'luxon';

type EventOptions = {
  name?: string;
  description?: string;
  location?: string;
  deadline: Deadline
}

export const generateGoogleEventLink = (options: EventOptions) => {
  const st = DateTime.fromJSDate(new Date(options.deadline.startDate)).plus({hour: -1}).setZone('Europe/Paris').toFormat('yyyyLLdd HHmmss', {locale: 'fr'}).replace(' ', 'T') + 'Z';
  const et = DateTime.fromJSDate(new Date(options.deadline.endDate)).plus({hour: -1}).setZone('Europe/Paris').toFormat('yyyyLLdd HHmmss', {locale: 'fr'}).replace(' ', 'T') + 'Z';
  return `https://www.google.com/calendar/event?action=TEMPLATE&dates=${st}%2F${et}&text=${options.name}&location=${options.location}&details=${options.description}`;
}

export const generateOutlookEventLink = (options: EventOptions) => {
  const st = DateTime.fromJSDate(new Date(options.deadline.startDate)).toFormat('yyyy-LL-dd HH:mm:ss', {locale: 'fr'}).replace(' ', 'T') + '+01:00';
  const et = DateTime.fromJSDate(new Date(options.deadline.endDate)).toFormat('yyyy-LL-dd HH:mm:ss', {locale: 'fr'}).replace(' ', 'T') + '+01:00';
  return `https://outlook.office.com/calendar/0/deeplink/compose?body=${options.description}&enddt=${encodeURIComponent(et)}&location=${options.location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${encodeURIComponent(st)}&subject=${options.name}`;
}
