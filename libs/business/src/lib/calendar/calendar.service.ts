import { Injectable } from "@nestjs/common";
import { Organization, SavePersonalCalendar, User } from "@pld/shared";
import { CalendarHelper } from "./calendar.helper";

@Injectable()
export class CalendarService {

  constructor(private calendarHelper: CalendarHelper) {
  }

  public getUserCalendar(user: User, requestUser: User) {
    return this.calendarHelper.getCalendar(requestUser);
  }

  public getCalendar(user: User) {
    return this.calendarHelper.getCalendar(user);
  }

  public getOrgCalendars(user: User, org: Organization) {
    return this.calendarHelper.getOrgCalendars(user, org);
  }

  public async saveCalendar(user: User, calendar: SavePersonalCalendar) {
    return this.calendarHelper.saveCalendar(user, calendar);
  }
}
