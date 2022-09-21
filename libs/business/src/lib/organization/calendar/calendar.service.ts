import { Injectable } from '@nestjs/common';
import {CalendarHelper} from "./calendar.helper";
import { NewCalendarBody, NewCalendarEvent, Organization, User } from "@pld/shared";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Calendar} from "./calendar.model";
import { CheckOrgPerm } from "../organization.util";

@Injectable()
export class CalendarService {

  constructor(
    @InjectModel('Calendar') private calendarModel: Model<Calendar>,
    private calendarHelper: CalendarHelper) {}

  @CheckOrgPerm()
  public createCalendar(user: User, org: Organization, body: NewCalendarBody) {
    return this.calendarHelper.createCalendar(user, org, body);
  }

  @CheckOrgPerm()
  public getAllCalendarsFromOrg(user: User, org: Organization) {
    return this.calendarHelper.getAllCalendars(user, org);
  }

  @CheckOrgPerm()
  public getCalendar(user: User, org: Organization, calendarId: string) {
    return this.calendarHelper.getCalendar(user, org, calendarId);
  }

  @CheckOrgPerm()
  public createEvent(user: User, org: Organization, calendar: Calendar, body: NewCalendarEvent) {
    return this.calendarHelper.createEvent(user, org, calendar, body);
  }

  @CheckOrgPerm()
  public getEvents(user: User, org: Organization, calendar: Calendar) {
    return this.calendarHelper.getEvents(user, org, calendar);
  }

  @CheckOrgPerm()
  public getEvent(user: User, org: Organization, calendar: Calendar, event: string) {
    return this.calendarHelper.getEvent(user, org, calendar, event);
  }

  public getAllEvents(user: User) {
    return this.calendarHelper.getAllEvents(user);
  }

}
