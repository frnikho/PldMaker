import { useCallback, useMemo, useState } from "react";
import { Calendar, CalendarEvent, Organization, Pld, Template } from "@pld/shared";

export function useMaker() {

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [plds, setPlds] = useState<Pld[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const org = useMemo(() => orgs[0], [orgs]);
  const pld = useMemo(() => plds[0], [plds]);
  const calendar = useMemo(() => calendars[0], [calendars]);
  const template = useMemo(() => templates[0], [templates]);
  const event = useMemo(() => events[0], [events]);

  const setOrg = useCallback((org: Organization) => setOrgs([org]), []);
  const setPld = useCallback((pld: Pld) => setPlds([pld]), []);
  const setCalendar = useCallback((calendar: Calendar) => setCalendars([calendar]), []);
  const setTemplate = useCallback((template: Template) => setTemplates([template]), []);
  const setEvent = useCallback((event: CalendarEvent) => setEvents([event]), []);

  return {
    org,
    orgs,
    pld,
    plds,
    calendar,
    calendars,
    template,
    templates,
    event,
    events,
    setOrg,
    setOrgs,
    setPld,
    setPlds,
    setCalendar,
    setCalendars,
    setTemplate,
    setTemplates,
    setEvent,
    setEvents,
  }

}
