import {User} from "../../user/User";

export class CalendarMember {
  user: User;
  status: CalendarMemberStatus;
  updateStatusDate: Date;

  constructor(user: User, status: CalendarMemberStatus, updateStatusDate: Date) {
    this.user = user;
    this.status = status;
    this.updateStatusDate = updateStatusDate;
  }
}

export enum CalendarMemberStatus {
  Invited,
  Declined,
  Accepted,
}

export class EventUpdateMemberStatusBody {
  status: CalendarMemberStatus;

  constructor(status: CalendarMemberStatus) {
    this.status = status;
  }
}
export class EventManageMemberBody {
  user: string;

  constructor(user: string) {
    this.user = user;
  }
}
