import {User} from "../../user/User";

export class CalendarMember {
  user: User;
  status: CalendarMemberStatus;

  constructor(user: User, status: CalendarMemberStatus) {
    this.user = user;
    this.status = status;
  }
}

export enum CalendarMemberStatus {
  Invited,
  Declined,
  Accepted,
}
