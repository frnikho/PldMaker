import {EditedField} from "./dod.schema";
import { Dod, Organization, User } from "@pld/shared";

export enum DodEvents {
  onDodUpdate = 'Dod.Updated',
  onDodStatusDeleted = 'DodStatus.Deleted',
  onDodStatusUpdated = 'DodStatus.Updated',
}

export class DodUpdateEvent {
  editedBy: string;
  editedFields: EditedField[];
  editedDod: string;

  constructor(editedBy: string, editedFields: EditedField[], editedDod: string) {
    this.editedBy = editedBy;
    this.editedFields = editedFields;
    this.editedDod = editedDod;
  }
}

export class DodStatusDeletedEvent {
  orgId: string;
  pldId: string;
  removedBy: string;
  dodStatusId: string;

  constructor(orgId: string, pldId: string, removedBy: string, dodStatusId: string) {
    this.orgId = orgId;
    this.removedBy = removedBy;
    this.dodStatusId = dodStatusId;
    this.pldId = pldId;
  }
}

export class DodStatusUpdatedEvent {
  org: Organization;
  beforeUpdatedDod: Dod;
  editedDod: Dod;
  updatedBy: User;

  constructor(user: User, org: Organization, beforeUpdatedDod: Dod, editedDod: Dod) {
    this.updatedBy = user;
    this.org = org;
    this.beforeUpdatedDod = beforeUpdatedDod;
    this.editedDod = editedDod;
  }
}
