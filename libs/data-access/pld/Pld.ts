import {DatedObject} from "../DatedObject";
import {PldOwnerType} from "./PldOwnerType";
import {PldStatus} from "./PldStatus";
import {User} from "../user/User";
import {Organization} from "../organization/Organization";

export type Pld = {
  description: string;
  manager: User;
  owner: User | Organization;
  ownerType: PldOwnerType;
  promotion: number;
  revisions: PldRevision[];
  status: PldStatus;
  tags: string[];
  title: string;
  version: number;
  _id: string;
} & DatedObject

export type PldRevision = {
  created_date: Date;
  version: string;
  owner: string;
  sections: string[];
  comments?: string;
}

export class CreatePldRevisionBody {

  created_date: Date;

  version: number;

  owner: string;

  sections: string[];

  comments?: string;

  constructor(created_date: Date, version: number, owner: string, sections: string[], comments?: string) {
    this.created_date = created_date;
    this.version = version;
    this.owner = owner;
    this.sections = sections;
    this.comments = comments;
  }
}
