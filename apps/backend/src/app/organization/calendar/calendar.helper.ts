import { Injectable } from "@nestjs/common";
import {Model, Query} from "mongoose";
import {Calendar} from "./calendar.model";
import {InjectModel} from "@nestjs/mongoose";
import {NewCalendarBody, NewCalendarEvent, Organization} from "@pld/shared";
import {CalendarEvent} from "./calendar_event.model";
import { CheckOrgPerm, checkOrgPermission } from "../organization.util";

@Injectable()
export class CalendarHelper {

  constructor(@InjectModel('Calendar') private calendarModel: Model<Calendar>,
              @InjectModel('CalendarEvent') private eventModel: Model<CalendarEvent>) {}

  public static populateAndExecute(query: Query<unknown, unknown>) {
    return query.populate('owner').exec();
  }

  public static populateAndExecuteEvent(query: Query<unknown, unknown>) {
    return query
      .populate(['owner', 'calendar'])
      .populate({path: 'calendar', populate: [{path: 'org', model: 'Organization'}, {path: 'owner', model: 'User'}]})
      .populate({path: 'invitedMembers', model: 'User'})
      .exec();
  }

  @CheckOrgPerm()
  public createCalendar(userId: string, org: Organization, body: NewCalendarBody) {
    return this.calendarModel.create({
      name: body.name,
      description: body.description,
      deadline: body.deadline,
      linkedPld: body.linkedPld,
      owner: userId,
      org: org,
    });
  }

  @CheckOrgPerm()
  public getAllCalendars(userId: string, org: Organization) {
    return CalendarHelper.populateAndExecute(this.calendarModel.find({org: org._id}));
  }

  @CheckOrgPerm()
  public getCalendar(userId: string, org: Organization, calendarId: string) {
    return CalendarHelper.populateAndExecute(this.calendarModel.findOne({_id: calendarId, org: org._id}));
  }

  @CheckOrgPerm()
  public async createEvent(userId: string, org: Organization, calendar: Calendar, body: NewCalendarEvent) {
    checkOrgPermission(userId, org);
    const createdModel = await this.eventModel.create({owner: userId, deadline: body.deadline, title: body.title, description: body.description, invitedMembers: body.invitedMembers, color: body.color, date: body.date, calendar: calendar._id, allDay: body.allDay});
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({_id: createdModel.id}));
  }

  @CheckOrgPerm()
  public async getEvents(userId: string, org: Organization, calendar: Calendar) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.find({calendar: calendar._id, $or: [{owner: userId}, {invitedMembers: {$in: [userId]}}]}));
  }

  @CheckOrgPerm()
  public async getEvent(userId: string, org: Organization, calendar: Calendar, eventId: string) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({calendar: calendar._id, _id: eventId, $or: [{owner: userId}, {invitedMembers: {$in: [userId]}}]}));
  }

}
