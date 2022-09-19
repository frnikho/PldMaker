import {User} from "../user/User";
import {OrgHistory} from "./OrgHistory";
import { Length } from "class-validator";

export class MigrateOrganizationBody {
  newOwnerId: string;

  constructor(newOwnerId: string) {
    this.newOwnerId = newOwnerId;
  }
}

export class OrganizationSectionUpdateBody {
  @Length(3)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class OrganizationSectionBody {
  @Length(3, 16)
  section: string;

  @Length(3, 64)
  name: string;

  constructor(section: string, name: string) {
    this.section = section;
    this.name = name;
  }
}

export class OrganizationSection {
  _id: string;
  section: string;
  name: string;
  org: Organization;
  owner: User;
  createdDate: Date;
  updatedDate: Date;

  constructor(_id: string, section: string, name: string, org: Organization, owner: User, createdDate: Date, updatedDate: Date) {
    this._id = _id;
    this.section = section;
    this.name = name;
    this.org = org;
    this.owner = owner;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}

export class Organization {
  members: User[];
  name: string;
  owner: User;
  description: string;
  versionShifting: number;
  _id: string;
  dodColors: DodColor[];
  history: OrgHistory[];
  sections: OrganizationSection[];
  created_date: Date;
  updated_date: Date;

  constructor(members: User[], name: string, owner: User, description: string, versionShifting: number, id: string, dodColors: DodColor[], history: OrgHistory[], sections: OrganizationSection[], created_date: Date, updated_date: Date) {
    this.members = members;
    this.name = name;
    this.owner = owner;
    this.description = description;
    this.versionShifting = versionShifting;
    this._id = id;
    this.dodColors = dodColors;
    this.history = history;
    this.sections = sections;
    this.created_date = created_date;
    this.updated_date = updated_date;
  }
}

export type DodColor = {
  name: string;
  color: string;
}
