import { User } from "../user/User";
import {Organization} from '../organization/Organization';
import { DodStatus } from "../dod/DodStatus";
import { IsOptional, Length } from "class-validator";
import { IsObjectID } from "../validator/ObjectIdValidator";
import { ObjectID } from "../Object";

export type TemplateHeaderSection = 'Titre' | 'Object' | 'Auteur' | 'Responsable' | 'E-mail' | 'Mots-clés' | 'promotion' | 'Date de la mise à jour' | 'Version du modèle'

export class TemplateHeader {
  generate: boolean;
  sections: Map<string, string>;

  constructor(generate: boolean, sections: Map<string, string>) {
    this.generate = generate;
    this.sections = sections;
  }
}

export class TemplateDod {
  generate: boolean;
  allStatus: boolean;
  status: DodStatus[];

  constructor(generate: boolean, allStatus: boolean, status: DodStatus[]) {
    this.generate = generate;
    this.allStatus = allStatus;
    this.status = status;
  }
}

export class TemplateResume {
  generate: boolean;
  @IsOptional()
  date?: Date;
  allStatus: boolean;
  status: DodStatus[];

  constructor(generate: boolean, allStatus: boolean, status: DodStatus[], date?: Date) {
    this.generate = generate;
    this.allStatus = allStatus;
    this.status = status;
    this.date = date;
  }
}

export class TemplateRevision {

}

export class Template {
  _id: string;
  owner: User;
  org: Organization;
  title: string;
  useAsDefault: boolean;
  dodTemplate: TemplateDod;
  resumeTemplate: TemplateResume;
  revisionTemplate: TemplateRevision;
  headerTemplate: TemplateHeader;
  createdDate: Date;
  updatedDate: Date;

  constructor(_id: string, owner: User, org: Organization, title: string, useAsDefault: boolean, dodTemplate: TemplateDod, resumeTemplate: TemplateResume, revisionTemplate: TemplateRevision, headerTemplate: TemplateHeader, createdDate: Date, updatedDate: Date) {
    this._id = _id;
    this.owner = owner;
    this.org = org;
    this.title = title;
    this.useAsDefault = useAsDefault;
    this.dodTemplate = dodTemplate;
    this.resumeTemplate = resumeTemplate;
    this.revisionTemplate = revisionTemplate;
    this.headerTemplate = headerTemplate;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}

export const defaultTemplateHeader: TemplateHeader = new TemplateHeader(true, new Map<string, string>);
export const defaultTemplateDod: TemplateDod = new TemplateDod(true, true, []);
export const defaultTemplateResume: TemplateResume = new TemplateResume(true, true, []);
export const defaultTemplateRevision: TemplateRevision = new TemplateRevision();

export class UpdateTemplateBody {

  title?: string;
  useAsDefault?: boolean;
  dodTemplate?: TemplateDod;
  resumeTemplate?: TemplateResume;
  revisionTemplate?: TemplateRevision;
  headerTemplate?: TemplateHeader;

  constructor(title?: string, useAsDefault?: boolean, dodTemplate?: TemplateDod, resumeTemplate?: TemplateResume, revisionTemplate?: TemplateRevision, headerTemplate?: TemplateHeader) {
    this.title = title;
    this.useAsDefault = useAsDefault;
    this.dodTemplate = dodTemplate;
    this.resumeTemplate = resumeTemplate;
    this.revisionTemplate = revisionTemplate;
    this.headerTemplate = headerTemplate;
  }
}

export class NewTemplateBody {

  @IsObjectID()
  owner: ObjectID;

  @IsObjectID()
  org: ObjectID;

  @Length(3, 128)
  title: string;

  useAsDefault?: boolean;
  dodTemplate?: TemplateDod;
  resumeTemplate?: TemplateResume;
  revisionTemplate?: TemplateRevision;
  headerTemplate?: TemplateHeader;


  constructor(owner: ObjectID, org: ObjectID, title: string, useAsDefault: boolean, dodTemplate?: TemplateDod, resumeTemplate?: TemplateResume, revisionTemplate?: TemplateRevision, headerTemplate?: TemplateHeader) {
    this.owner = owner;
    this.org = org;
    this.title = title;
    this.useAsDefault = useAsDefault;
    this.dodTemplate = dodTemplate;
    this.resumeTemplate = resumeTemplate;
    this.revisionTemplate = revisionTemplate;
    this.headerTemplate = headerTemplate;
  }
}
