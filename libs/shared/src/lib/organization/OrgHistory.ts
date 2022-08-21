import {User} from "../user/User";

export enum OrgHistoryAction {
  UPDATE_TITLE = 'UPDATE_TITLE',
  UPDATE_DOD_STATUS = 'UPDATE_DOD_STATUS',
  ADD_MEMBER = 'ADD_MEMBER',
  REMOVE_MEMBER = 'REMOVE_MEMBER',
}

export type OrgHistory = {
  date: Date;
  owner: User;
  member?: User;
  action: OrgHistoryAction,
}
