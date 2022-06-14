import {DatedObject} from "../DatedObject";
import {PldOwnerType} from "./PldOwnerType";
import {User} from "../user/User";
import {Organization} from "../organization/Organization";

export type Pld = {
  description: string;
  manager: User;
  owner: User | Organization;
  ownerType: PldOwnerType;
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

} & DatedObject

export type PldRevision = {
  created_date: Date;
  version: string;
  owner: User;
  sections: string[];
  comments?: string;
  currentStep: string;
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
