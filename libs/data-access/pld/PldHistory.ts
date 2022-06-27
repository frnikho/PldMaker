import {User} from "../user/User";
import {Dod, EditedField} from "../dod/Dod";
import {PldRevision} from "./Pld";

export enum PldHistoryAction {
  PldUpdated = 'onPldUpdated',
  DodCreated = 'onDodCreated',
  DodDeleted = 'onDodDeleted',
  PldRevisionAdded = 'onPldRevisionAdded',
  PldSigned = 'onPldSigned',
  PldStatusUpdated = 'onPldStatusUpdated',
  PldDataImported = 'onPldDataImported'
}

export type PldHistory = {
  date: Date;
  owner: User;
  dod?: Dod;
  revision?: PldRevision;
  action: PldHistoryAction,
  editedFields: EditedField[];
}
