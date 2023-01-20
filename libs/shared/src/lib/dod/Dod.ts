import {Pld} from "../pld/Pld";
import {User} from "../user/User";
import {DodHistoryAction} from "./DodHistory";
import { DodStatus } from "./DodStatus";

export class Dod {
  _id: string;
  version: string;
  title: string;
  skinOf: string;
  want: string;
  description: string;
  descriptionOfDone: string[];
  estimatedWorkTime: UserWorkTime[];
  pldOwner: Pld;
  owner: User;
  status: DodStatus;
  history: DodHistory[];
  created_date: Date;
  updated_date: Date;
  sketch: boolean;

  constructor(id: string, version: string, title: string, skinOf: string, want: string, description: string, descriptionOfDone: string[], estimatedWorkTime: UserWorkTime[], pldOwner: Pld, owner: User, status: DodStatus, history: DodHistory[], created_date: Date, updated_date: Date, sketch: boolean) {
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
    this.sketch = sketch;
  }
}

export type UserWorkTime = {
  users: User[];
  value: number;
  format: string,
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

export type SetDodStatus = {
  statusId: string;
}
