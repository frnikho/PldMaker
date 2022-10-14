import { User } from "../user/User";
import {Organization} from '../organization/Organization';
import { Length } from "class-validator";
import { defaultTemplateColor, TemplateColor } from "./TemplateColor";
import { defaultTemplateReport, TemplateReport } from "./TemplateReport";
import { defaultTemplateDod, TemplateDod } from "./TemplateDod";
import { defaultTemplateRevision, TemplateRevision } from "./TemplateRevision";
import { defaultTemplateDescription, TemplateDescription } from "./TemplateDescription";

export class Template {
  _id: string;
  owner: User;
  org: Organization;
  title: string;
  useAsDefault: boolean;
  picture: string;
  colorTemplate: TemplateColor;
  dodTemplate: TemplateDod;
  reportTemplate: TemplateReport;
  revisionTemplate: TemplateRevision;
  descriptionTemplate: TemplateDescription;
  createdDate: Date;
  updatedDate: Date;

  constructor(id: string, owner: User, org: Organization, title: string, picture: string, useAsDefault: boolean, colorTemplate: TemplateColor, dodTemplate: TemplateDod, reportTemplate: TemplateReport, revisionTemplate: TemplateRevision, descriptionTemplate: TemplateDescription, createdDate: Date, updatedDate: Date) {
    this._id = id;
    this.owner = owner;
    this.org = org;
    this.title = title;
    this.useAsDefault = useAsDefault;
    this.picture = picture;
    this.colorTemplate = colorTemplate;
    this.dodTemplate = dodTemplate;
    this.reportTemplate = reportTemplate;
    this.revisionTemplate = revisionTemplate;
    this.descriptionTemplate = descriptionTemplate;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}


export class UpdateTemplateBody {

  title?: string;
  useAsDefault?: boolean;
  colorTemplate?: TemplateColor;
  dodTemplate?: TemplateDod;
  reportTemplate?: TemplateReport;
  revisionTemplate?: TemplateRevision;
  descriptionTemplate?: TemplateDescription;

  constructor(title?: string, useAsDefault?: boolean, colorTemplate?: TemplateColor, dodTemplate?: TemplateDod, reportTemplate?: TemplateReport, revisionTemplate?: TemplateRevision, descriptionTemplate?: TemplateDescription) {
    this.title = title;
    this.useAsDefault = useAsDefault;
    this.colorTemplate = colorTemplate;
    this.dodTemplate = dodTemplate;
    this.reportTemplate = reportTemplate;
    this.revisionTemplate = revisionTemplate;
    this.descriptionTemplate = descriptionTemplate;
  }
}

export class NewTemplateBody {

  @Length(3, 128)
  title: string;

  useAsDefault?: boolean;

  colorTemplate?: TemplateColor;
  dodTemplate?: TemplateDod;
  reportTemplate?: TemplateReport;
  revisionTemplate?: TemplateRevision;
  descriptionTemplate?: TemplateDescription;

  constructor(title: string, useAsDefault?: boolean, colorTemplate?: TemplateColor, dodTemplate?: TemplateDod, reportTemplate?: TemplateReport, revisionTemplate?: TemplateRevision, descriptionTemplate?: TemplateDescription) {
    this.title = title;
    this.useAsDefault = useAsDefault;
    this.colorTemplate = colorTemplate;
    this.dodTemplate = dodTemplate;
    this.reportTemplate = reportTemplate;
    this.revisionTemplate = revisionTemplate;
    this.descriptionTemplate = descriptionTemplate;
  }
}

export type TemplateType = {
  colorTemplate: TemplateColor;
  dodTemplate: TemplateDod;
  reportTemplate: TemplateReport;
  revisionTemplate: TemplateRevision;
  descriptionTemplate: TemplateDescription;
}

export const defaultTemplate = {
  reportTemplate: defaultTemplateReport,
  colorTemplate: defaultTemplateColor,
  descriptionTemplate: defaultTemplateDescription,
  dodTemplate: defaultTemplateDod,
  revisionTemplate: defaultTemplateRevision,
}
