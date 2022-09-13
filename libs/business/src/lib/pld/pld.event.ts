import {EditedField} from "../dod/dod.schema";
import {PldHistory, RevisionUpdate} from "./pld.schema";

export enum PldEvents {
  onPldUpdate = 'Pld.Updated',
  onDodCreated = 'Pld.Dod.Created',
  onDodDeleted = 'Pld.Dod.Deleted',
  onPldRevisionAdded = 'Pld.Revision.Added',
  onPldSigned = 'Pld.Signed',
  onPldStatusUpdated = 'Pld.Status.Updated',
  onPldDataImported = 'Pld.Data.Imported',
}

export class PldUpdatedEvent {
  updatedBy: string;
  editedPld: string;
  editedFields: EditedField[];

  constructor(updatedBy: string, editedPld: string, editedFields: EditedField[]) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
    this.editedFields = editedFields;
  }
}

export class PldDodCreatedEvent {
  updatedBy: string;
  editedPld: string;
  dodId: string;

  constructor(updatedBy: string, editedPld: string, dodId: string) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
    this.dodId = dodId;
  }
}

export class PldDodDeletedEvent {
  updatedBy: string;
  editedPld: string;
  dodId: string;

  constructor(updatedBy: string, editedPld: string, dodId: string) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
    this.dodId = dodId;
  }
}

export class PldRevisionAddedEvent {
  updatedBy: string;
  editedPld: string;
  revision: RevisionUpdate;

  constructor(updatedBy: string, editedPld: string, revision: RevisionUpdate) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
    this.revision = revision;
  }
}

export class PldSignedEvent {
  updatedBy: string;
  editedPld: string;
  editedFields: EditedField[];

  constructor(updatedBy: string, editedPld: string, editedFields: EditedField[]) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
    this.editedFields = editedFields;
  }
}

export class PldStatusUpdatedEvent {
  updatedBy: string;
  editedPld: string;
  editedFields: EditedField[];

  constructor(updatedBy: string, editedPld: string, editedFields: EditedField[]) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
    this.editedFields = editedFields;
  }
}

export class PldDataImportedEvent {
  updatedBy: string;
  editedPld: string;

  constructor(updatedBy: string, editedPld: string) {
    this.updatedBy = updatedBy;
    this.editedPld = editedPld;
  }
}
