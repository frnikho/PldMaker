import {DatedObject} from "../../DatedObject";
import {Pld} from "../Pld";
import {User} from "../../user/User";

export type Dod = {
  _id: string;
  version: string;
  title: string;
  skinOf: string;
  want: string;
  description: string;
  descriptionOfDone: string[];
  created_date: Date;
  updated_date: Date;
  estimatedWorkTime: UserWorkTime[];
  pldOwner: Pld | string;
  owner: User | string;
  status: DodStatus;
  revisions: DodRevision[]
} & DatedObject;

export type UserWorkTime = {
  users: string[];
  value: number;
  format: string,
}

export enum DodStatus {
  TODO = 'A faire',
  DOING = 'En cours',
  TO_TRY = 'A tester',
  DONE = 'Fini',
  NOT_FINISH = 'Non fini'
}

export type DodRevision = {
  updated_by: User | string;
  version: number;
  title: string;
  skinOf: string;
  want: string;
  description: string;
  descriptionOfDone: string[];
  estimatedWorkTime: UserWorkTime[];
} & DatedObject
