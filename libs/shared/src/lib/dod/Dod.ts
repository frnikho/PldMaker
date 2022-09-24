import {Pld} from "../pld/Pld";
import {User} from "../user/User";
import {DodHistoryAction} from "./DodHistory";

export class Dod {
  _id: string;
  version: string;
  title: string;
  skinOf: string;
  want: string;
  description: string;
  descriptionOfDone: string[];
  estimatedWorkTime: UserWorkTime[];
  pldOwner: Pld | string;
  owner: User;
  status: DodStatus | string;
  history: DodHistory[];
  created_date: Date;
  updated_date: Date;

  constructor(id: string, version: string, title: string, skinOf: string, want: string, description: string, descriptionOfDone: string[], estimatedWorkTime: UserWorkTime[], pldOwner: Pld | string, owner: User, status: DodStatus | string, history: DodHistory[], created_date: Date, updated_date: Date) {
    this._id = id;
    this.version = version;
    this.title = title;
    this.skinOf = skinOf;
    this.want = want;
    this.description = description;
    this.descriptionOfDone = descriptionOfDone;
    this.estimatedWorkTime = estimatedWorkTime;
    this.pldOwner = pldOwner;
    this.owner = owner;
    this.status = status;
    this.history = history;
    this.created_date = created_date;
    this.updated_date = updated_date;
  }
}

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
