import { Injectable } from '@nestjs/common';
import {CalendarHelper} from "./calendar.helper";
import {NewCalendarBody, Organization} from "@pld/shared";
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

}
