import { Injectable } from "@nestjs/common";
import {Model, Query} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { Calendar, CalendarMemberStatus, NewCalendarBody, NewCalendarEvent, Organization, EventUpdateMemberStatusBody, User, CalendarEvent, EventManageMemberBody, EventUpdateBody } from "@pld/shared";

@Injectable()
export class CalendarHelper {

  constructor(@InjectModel('Calendar') private calendarModel: Model<Calendar>,
              @InjectModel('CalendarEvent') private eventModel: Model<CalendarEvent>) {}

  public static populateAndExecute(query: Query<unknown, unknown>) {
    return query.populate('owner').exec();
  }

  public static populateAndExecuteEvent<T, Z>(query: Query<T, Z>) {
    return query
      .populate(['owner', 'calendar'])
      .populate({path: 'calendar', populate: [{path: 'org', model: 'Organization'}, {path: 'owner', model: 'User'}]})
      .populate({path: 'invitedMembers', populate: [{path: 'user', model: 'User'}]})
      .exec();
  }

  /**
   * Calendar
   */

  public createCalendar(user: User, org: Organization, body: NewCalendarBody) {
    return this.calendarModel.create({
      name: body.name,
      description: body.description,
      deadline: body.deadline,
      linkedPld: [],
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

  public deleteCalendar(user: User, org: Organization, calendar: Calendar) {
    return CalendarHelper.populateAndExecute(this.calendarModel.findOneAndDelete({_id: calendar._id}, {new: true}));
  }

  /**
   * Events
   */

  public async createEvent(user: User, org: Organization, calendar: Calendar, body: NewCalendarEvent) {
    const invitedMembers = body.invitedMembers.map((member) => ({user: member, status: CalendarMemberStatus.Invited}));
    const createdModel = await this.eventModel.create({owner: user, deadline: body.deadline, title: body.title, description: body.description, invitedMembers: invitedMembers, color: body.color, date: body.date, calendar: calendar._id, allDay: body.allDay});
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({_id: createdModel.id}));
  }

  public async getEvents(user: User, org: Organization, calendar: Calendar) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.find({calendar: calendar._id, $or: [{owner: user}, {"invitedMembers.user": {$in: [user._id.toString()]}}]}));
  }

  public async getEvent(user: User, org: Organization, calendar: Calendar, eventId: string) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({calendar: calendar._id, _id: eventId, $or: [{owner: user}, {"invitedMembers.user": {$in: [user._id.toString()]}}]}));
  }

  public async getAllEvents(user: User) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.find({$or: [{owner: user}, {"invitedMembers.user": {$in: [user._id.toString()]}}]}));
  }

  public async deleteAllUserEvents(user: User) {
    //Delete all owned events
    await CalendarHelper.populateAndExecuteEvent(this.eventModel.deleteMany({owner: user}));
    await CalendarHelper.populateAndExecuteEvent(this.eventModel.updateMany({invitedMembers: {$in: [user._id.toString()]}}, {$pullAll: {invitedMembers: {user: user}}}));
  }

  public async updateMemberStatus(user: User, org: Organization, calendar: Calendar, event: CalendarEvent, body: EventUpdateMemberStatusBody) {
    const eventToUpdate: CalendarEvent = await CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({_id: event._id}));
    const invitedMembers = eventToUpdate.invitedMembers.map((im) => {
      if (im.user._id.toString() === user._id.toString()) {
        im.status = body.status
        im.updateStatusDate = new Date();
      }
      return {
        user: im.user._id.toString(),
        status: im.status,
        updateStatusDate: im.updateStatusDate,
      };
    });
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOneAndUpdate({_id: event._id}, {invitedMembers}, {new: true}));
  }

  public async inviteMember(user: User, org: Organization, calendar: Calendar, event: CalendarEvent, body: EventManageMemberBody) {
    const eventToUpdate: CalendarEvent = await CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({_id: event._id}));
    const invitedMembers = eventToUpdate.invitedMembers.map((a) => ({
      user: a.user._id.toString(),
      status: a.status,
      updateStatusDate: a.updateStatusDate,
    }));
    invitedMembers.push({
      user: body.user,
      status: CalendarMemberStatus.Invited,
      updateStatusDate: undefined,
    });
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOneAndUpdate({_id: event._id}, {invitedMembers}, {new: true}));
  }

  public async revokeMember(user: User, org: Organization, calendar: Calendar, event: CalendarEvent, body: EventManageMemberBody) {
    const eventToUpdate: CalendarEvent = await CalendarHelper.populateAndExecuteEvent(this.eventModel.findOne({_id: event._id}));
    const invitedMembers = eventToUpdate.invitedMembers.filter((m) => m.user._id.toString() !== body.user).map((a) => ({
      user: a.user._id.toString(),
      status: a.status,
      updateStatusDate: a.updateStatusDate,
    }));
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOneAndUpdate({_id: event._id}, {invitedMembers}, {new: true}));
  }

  public updateEvent(user: User, org: Organization, calendar: Calendar, event: CalendarEvent, body: EventUpdateBody) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOneAndUpdate({_id: event._id}, {...body, updatedDate: new Date()}, {new: true}));
  }

  public deleteEvent(user: User, org: Organization, calendar: Calendar, event: CalendarEvent) {
    return CalendarHelper.populateAndExecuteEvent(this.eventModel.findOneAndDelete({_id: event._id}, {new: true}));
  }

}
