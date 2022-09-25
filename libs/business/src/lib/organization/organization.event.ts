import {ObjectId} from "mongoose";

export enum OrgEvents {
  onDodStatusDeleted = 'Org.Status.Deleted',
  onMemberAdded = 'Org.Member.Added',
  onMemberRemoved = 'Org.Member.Removed',
  onUpdateDodStatus = 'Org.DodStatus.Updated',
  onUpdateOrg = 'Org.Update'
}

export class OrgAddMemberEvent {
  orgId: string;
  newMemberId: string | ObjectId;
  addedBy: string | ObjectId;

  constructor(orgId: string, newMemberId: string, addedBy: string) {
    this.orgId = orgId;
    this.newMemberId = newMemberId;
    this.addedBy = addedBy;
  }
}

export class OrgRemoveMemberEvent {
  orgId: string;
  removedMemberId: string;
  removedBy: string;

  constructor(orgId: string, removedMemberId: string, removedBy: string) {
    this.orgId = orgId;
    this.removedMemberId = removedMemberId;
    this.removedBy = removedBy;
  }
}

export class OrgDodStatusDeletedEvent {
  orgId: string;
  removedBy: string;
  dodStatusId: string;
}
