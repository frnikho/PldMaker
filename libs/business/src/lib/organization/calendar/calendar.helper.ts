import { Injectable } from "@nestjs/common";
import {Model, Query} from "mongoose";
import {Calendar} from "./calendar.model";
import {InjectModel} from "@nestjs/mongoose";
import { CalendarMember, CalendarMemberStatus, NewCalendarBody, NewCalendarEvent, Organization, User } from "@pld/shared";
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
      .populate({path: 'invitedMembers', populate: [{path: 'user', model: 'User'}]})
      .exec();
  }

  public createCalendar(user: User, org: Organization, body: NewCalendarBody) {
    return this.calendarModel.create({
      name: body.name,
      description: body.description,
      deadline: body.deadline,
      linkedPld: body.linkedPld,
      owner: user,
      org: org,
    });
  }

  public getAllCalendars(user: User, org: Organization) {
    return CalendarHelper.populateAndExecute(this.calendarModel.find({org: org._id}));
  }

  public getCalendar(user: User, org: Organization, calendarId: string) {
    return CalendarHelper.populateAndExecute(this.calendarModel.findOne({_id: calendarId, org: org._id}));
  }

  public async createEvent(user: User, org: Organization, calendar: Calendar, body: NewCalendarEvent) {
    const invitedMembers = body.invitedMembers.map((member) => ({user: member, status: CalendarMemberStatus.Invited}));
    const createdModel = await this.eventModel.create({owner: user, deadline: body.deadline, title: body.title, description: body.description, invitedMembers: invitedMembers, color: body.color, date: body.date, calendar: calendar._id, allDay: body.allDay});
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({_id: createdModel.id}));
  }

  public async getEvents(user: User, org: Organization, calendar: Calendar) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.find({calendar: calendar._id, $or: [{owner: user}, {invitedMembers: {$in: [user._id.toString()]}}]}));
  }

  public async getEvent(user: User, org: Organization, calendar: Calendar, eventId: string) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({calendar: calendar._id, _id: eventId, $or: [{owner: user}, {invitedMembers: {$in: [user._id.toString()]}}]}));
  }

  public async getAllEvents(user: User) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.find({$or: [{owner: user}, {invitedMembers: {$in: [user._id.toString()]}}]}));
  }

  public async deleteAllUserEvents(user: User) {
    //Delete all owned events
    await CalendarHelper.populateAndExecuteEvent(this.eventModel.deleteMany({owner: user}));
    await CalendarHelper.populateAndExecuteEvent(this.eventModel.updateMany({invitedMembers: {$in: [user._id.toString()]}}, {$pullAll: {invitedMembers: {user: user}}}));
  }

}
