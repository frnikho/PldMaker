import {EditedField} from "./dod.schema";

export enum DodEvents {
  onDodUpdate = 'Dod.Updated'
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
