import { useState } from "react";
import { Calendar, Organization, Pld, Template } from "@pld/shared";

export function useMaker() {

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [plds, setPlds] = useState<Pld[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const org = orgs[0];
  const pld = plds[0];
  const calendar = calendars[0];
  const template = templates[0];

  const setOrg = (org: Organization) => setOrgs([org]);
  const setPld = (pld: Pld) => setPlds([pld]);
  const setCalendar = (calendar: Calendar) => setCalendars([calendar]);
  const setTemplate = (template: Template) => setTemplates([template]);

  return {
    org,
    orgs,
    pld,
    plds,
    calendar,
    calendars,
    template,
    templates,
    setOrg,
    setOrgs,
    setPld,
    setPlds,
    setCalendar,
    setCalendars,
    setTemplate,
    setTemplates,
  }

}
