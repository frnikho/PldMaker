import {User} from "../user/User";
import {Organization} from "../organization/Organization";
import {PldHistory} from "./PldHistory";

export class Pld {
  description: string;
  manager: User;
  owner: User;
  org: Organization;
  promotion: number;
  revisions: PldRevision[];
  status: string;
  tags: string[];
  title: string;
  version: number;
  _id: string;

  steps: string[];
  startingDate: Date;
  endingDate: Date;

  currentStep: string;

  history: PldHistory[];

  created_date: Date;
  updated_date: Date;

  picture: string;


  constructor(description: string, manager: User, owner: User, org: Organization, promotion: number, revisions: PldRevision[], status: string, tags: string[], title: string, version: number, id: string, steps: string[], startingDate: Date, endingDate: Date, currentStep: string, history: PldHistory[], created_date: Date, updated_date: Date, picture: string) {
    this.description = description;
    this.manager = manager;
    this.owner = owner;
    this.org = org;
    this.promotion = promotion;
    this.revisions = revisions;
    this.status = status;
    this.tags = tags;
    this.title = title;
    this.version = version;
    this._id = id;
    this.steps = steps;
    this.startingDate = startingDate;
    this.endingDate = endingDate;
    this.currentStep = currentStep;
    this.history = history;
    this.created_date = created_date;
    this.updated_date = updated_date;
    this.picture = picture;
  }
}

export type PldRevision = {
  created_date: Date;
  version: number;
  owner: User;
  sections: string[];
  comments?: string;
  currentStep: string;
}

export class UpdatePldRevisionBody {
  comments: string;
  sections: string[];
  version: number;

  constructor(comments: string, sections: string[], version: number) {
    this.comments = comments;
    this.sections = sections;
    this.version = version;
  }
}

export class CreatePldRevisionBody {

  created_date: Date;

  version: number;

  owner: string;

  sections: string[];

  comments?: string;

  currentStep: string;

  constructor(created_date: Date, version: number, owner: string, sections: string[], currentStep: string, comments?: string) {
    this.created_date = created_date;
    this.version = version;
    this.owner = owner;
    this.sections = sections;
    this.comments = comments;
    this.currentStep = currentStep;
  }
}
