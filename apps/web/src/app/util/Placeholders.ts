import { Dod, DodStatus, Organization, OrganizationSection, Pld, PldRevision, User, UserWorkTime } from "@pld/shared";
import { formatShortDate, months, weeksDay } from "@pld/utils";

export type PlaceholderType = {
  org?: Organization;
  pld?: Pld;
  user?: User;
  dod?: Dod;
  dodStatus?: DodStatus;
  sections?: OrganizationSection[];
  workTime?: UserWorkTime;
  revision?: PldRevision;
  definition?: string;
  html?: boolean;
  docx?: boolean;
}

export const getPlaceholder = (text: string, values?: PlaceholderType): string => {
  let newText = text;
  newText = values?.org ? getOrgPlaceholders(text, values.org) : newText;
  newText = values?.pld ? getPldPlaceholders(newText, values.pld) : newText;
  newText = values?.dod ? getDodPlaceholders(newText, values.dod) : newText;
  newText = values?.user ? getUserPlaceholders(newText, values.user) : newText;
  newText = values?.workTime ? getDodWorkTimePlaceholders(newText, values.workTime) : newText;
  newText = values?.html ? getHTMLPlaceholders(newText) : newText;
  newText = values?.definition ? getDefinitionPlaceholders(newText, values.definition) : newText;
  newText = values?.dodStatus ? getStatusPlaceholders(newText, values.dodStatus) : newText;
  newText = values?.revision ? getRevisionPlaceholders(newText, values.revision) : newText;
  newText = values?.docx ? getDocxPlaceholders(newText) : newText;
  return newText;
}

export const getRevisionPlaceholders = (text: string, revision: PldRevision) => {
  let newText = text;
  newText = newText.replaceAll('%revision_comment%', revision.comments ?? '');
  newText = newText.replaceAll('%revision_version%', revision.version.toFixed(1));
  newText = newText.replaceAll('%revision_sections%', revision.sections.join(', '));
  newText = getUserPlaceholders(newText, revision.owner, 'revision_owner_');
  newText = getDatePlaceholders(newText, new Date(revision.created_date), 'revision_date');
  return newText;
}

const getOrgPlaceholders = (text: string, org: Organization): string => {
  let newText = text;
  newText = newText.replaceAll('%org_name%', org.name);
  newText = newText.replaceAll('%org_description%', org.description);
  newText = getUserPlaceholders(newText, org.owner, 'org_owner_');
  return newText;
}

const getPldPlaceholders = (text: string, pld: Pld): string => {
  let newText = '';
  newText = text.replaceAll('%pld_name%', pld.title);
  newText = newText.replaceAll('%pld_description%', pld.description);
  newText = newText.replaceAll('%pld_version%', pld.version.toFixed(2));
  newText = newText.replaceAll('%pld_name%', pld.title);
  newText = newText.replaceAll('%pld_status%', pld.status);
  newText = newText.replaceAll('%pld_step%', pld.currentStep);
  newText = newText.replaceAll('%pld_keywords%', pld.tags.join(', '));
  newText = newText.replaceAll('%pld_promotion%', pld.promotion.toFixed(0));
  newText = getUserPlaceholders(newText, pld.manager, 'pld_manager_');
  newText = getUserPlaceholders(newText, pld.manager, 'pld_owner_');
  newText = getDatePlaceholders(newText, new Date(pld.startingDate), 'pld_start');
  newText = getDatePlaceholders(newText, new Date(pld.endingDate), 'pld_end');
  newText = getDatePlaceholders(newText, new Date(pld.created_date), 'pld_created');
  newText = getDatePlaceholders(newText, new Date(pld.created_date), 'pld_updated');
  return newText;
}

const getDatePlaceholders = (text: string, date: Date, prefix) => {
  let newText = '';
  newText = text.replaceAll(`%${prefix}_month%`, months[date.getMonth()]);
  newText = newText.replaceAll(`%${prefix}_numeric_month%`, String(date.getMonth() + 1));
  newText = newText.replaceAll(`%${prefix}_year%`, String(date.getFullYear()));
  newText = newText.replaceAll(`%${prefix}_week_day%`, weeksDay[date.getDay()]);
  newText = newText.replaceAll(`%${prefix}_day%`, String(date.getDay() + 1));
  newText = newText.replaceAll(`%${prefix}_numeric%`, formatShortDate(date));
  return newText;
}

const getDodPlaceholders = (text: string, dod: Dod) => {
  let newText = '';
  newText = text.replaceAll(`%dod_version%`, dod.version);
  newText = newText.replaceAll(`%dod_title%`, dod.title);
  newText = newText.replaceAll(`%dod_skinof%`, dod.skinOf);
  newText = newText.replaceAll(`%dod_wantto%`, dod.want);
  newText = newText.replaceAll(`%dod_description%`, dod.description);
  return newText;
}

export const getHTMLPlaceholders = (text: string) => {
  let newText = '';
  newText = text.replaceAll('\\n', '</br>');
  newText = newText.replaceAll('\\t', '<span style="margin-left: 18px"/>');
  return newText;
}

export const getDodWorkTimePlaceholders = (text: string, wt: UserWorkTime) => {
  let newText = '';
  newText = text.replaceAll('%dod_wt_value%', String(wt.value));
  return newText;
}

export const getUserPlaceholders = (text: string, user: User, prefix = 'user_') => {
  let newText = '';
  newText = text.replaceAll(`%${prefix}firstname%`, user.firstname);
  newText = newText.replaceAll(`%${prefix}lastname_up%`, user.lastname.toUpperCase());
  newText = newText.replaceAll(`%${prefix}lastname%`, user.lastname);
  newText = newText.replaceAll(`%${prefix}email%`, user.email);
  return newText;
}

export const getDefinitionPlaceholders = (text: string, definition: string) => {
  let newText = '';
  newText = text.replaceAll('%dod_definition%', definition);
  return newText;
}

export const getStatusPlaceholders = (text: string, status: DodStatus) => {
  let newText = '';
  newText = text.replaceAll('%status_name%', status.name);
  newText = newText.replaceAll('%status_color%', status.color);
  return newText;
}

export const getDocxPlaceholders = (text: string) => {
  let newText = '';
  newText = text.replaceAll('\\t', '    ');
  newText = newText.replaceAll('\\n', '');
  return newText;
}
