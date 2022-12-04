import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { Organization, PersonalCalendar, SavePersonalCalendar } from "@pld/shared";
import { User } from "@pld/shared";

@Injectable()
export class CalendarHelper {

  constructor(@InjectModel('PersonalCalendar') private calendarModel: Model<PersonalCalendar>) {
  }

  public static populateAndExecute<T, Z>(query: Query<T, Z>) {
    return query.populate('owner')
      .exec();
  }

  public getCalendar(user: User) {
    return CalendarHelper.populateAndExecute(this.calendarModel.findOne({owner: user}));
  }

  public getOrgCalendars(user: User, org: Organization) {
    return CalendarHelper.populateAndExecute(this.calendarModel.find({owner: {$in: [...org.members.map((u) => u._id), org.owner._id]}}));
  }

  public async saveCalendar(user: User, calendar: SavePersonalCalendar) {
    if (await this.getCalendar(user) === null) {
      return this.calendarModel.create({owner: user, events: calendar.events})
    } else {
      return CalendarHelper.populateAndExecute(this.calendarModel.findOneAndUpdate({owner: user}, {events: calendar.events}, {new: true}));
    }
  }

}
