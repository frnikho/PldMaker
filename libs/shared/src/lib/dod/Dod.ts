import {DatedObject} from "../DatedObject";
import {Pld} from "../pld/Pld";
import {User} from "../user/User";
import {DodHistoryAction} from "./DodHistory";

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
  status: DodStatus | string;
  history: DodHistory[]
} & DatedObject;

export type UserWorkTime = {
  users: User[];
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

export type EditedField = {
  name: string;
  lastValue: string;
  value: string;
}

export type DodHistory = {
  date: Date;
  editedFields: EditedField[]
  owner: User;
  action: DodHistoryAction;
}
