import {Injectable} from "@nestjs/common";
import {Model, Query} from "mongoose";
import {Calendar} from "./calendar.model";
import {InjectModel} from "@nestjs/mongoose";
import {NewCalendarBody, Organization} from "@pld/shared";

@Injectable()
export class CalendarHelper {

  constructor(@InjectModel('Calendar') private calendarModel: Model<Calendar>) {}

  public static populateAndExecute(query: Query<unknown, Calendar>) {
    return query.populate('owner').exec();
  }

  public createCalendar(userId: string, org: Organization, body: NewCalendarBody) {
    return this.calendarModel.create({
      name: body.name,
      description: body.description,
      deadline: body.deadline,
      linkedPld: body.linkedPld,
      owner: userId,
      org: org._id,
    });
  }

  public getAllCalendars(userId: string, org: Organization) {
    return CalendarHelper.populateAndExecute(this.calendarModel.find({org: org._id}));
  }

}
