import { Injectable } from "@nestjs/common";
import { CalendarEvent, Organization, User } from "@pld/shared";
import { AvailableMail } from "./mail.list";
import { MailHelper } from "./mail.helper";

@Injectable()
export class MailService {

  constructor(private mailHelper: MailHelper) {
  }

  public sendWelcomeMail(user: User, email: AvailableMail) {
    return this.mailHelper.sendWelcomeMail(user, email);
  }

  public sendInvitationOrg(user: User, org: Organization, invitedByUser: string) {
    return this.mailHelper.sendInvitationOrg(user, org, invitedByUser);
  }

  public sendChangePasswordMail(user: User, token: string) {
    return this.mailHelper.sendChangePasswordMail(user, token);
  }

  public sendMeetupInvitation(user: User, orgId: string, calendarId: string, event: CalendarEvent) {
    return this.mailHelper.sendMeetupInvitation(user, orgId, calendarId, event);
  }

}
