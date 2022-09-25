import {EditedField} from "./dod.schema";

export enum DodEvents {
  onDodUpdate = 'Dod.Updated',
  onDodStatusDeleted = 'DodStatus.Deleted',
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
