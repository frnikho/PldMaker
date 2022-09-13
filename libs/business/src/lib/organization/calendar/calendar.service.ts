import { Injectable } from '@nestjs/common';
import {CalendarHelper} from "./calendar.helper";
import {NewCalendarBody, NewCalendarEvent, Organization} from "@pld/shared";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Calendar} from "./calendar.model";

@Injectable()
export class CalendarService {

  constructor(
    @InjectModel('Calendar') private calendarModel: Model<Calendar>,
    private calendarHelper: CalendarHelper) {}

  public createCalendar(userId: string, org: Organization, body: NewCalendarBody) {
    return this.calendarHelper.createCalendar(userId, org, body);
  }

  public getAllCalendarsFromOrg(userId: string, org: Organization) {
    return this.calendarHelper.getAllCalendars(userId, org);
  }

  public getCalendar(userId: string, org: Organization, calendarId: string) {
    return this.calendarHelper.getCalendar(userId, org, calendarId);
  }

  public createEvent(userId: string, org: Organization, calendar: Calendar, body: NewCalendarEvent) {
    return this.calendarHelper.createEvent(userId, org, calendar, body);
  }

  public getEvents(userId: string, org: Organization, calendar: Calendar) {
    return this.calendarHelper.getEvents(userId, org, calendar);
  }

  public getEvent(userId: string, org: Organization, calendar: Calendar, event: string) {
    return this.calendarHelper.getEvent(userId, org, calendar, event);
  }

}
