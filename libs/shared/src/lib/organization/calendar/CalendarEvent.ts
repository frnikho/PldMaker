import {Color, Deadline} from "@pld/utils";
import {User} from "../../user/User";
import {Length} from "class-validator";
import { CalendarMember } from "./CalendarMember";
import { Calendar } from "./Calendar";

export class CalendarEvent {
  _id: string;
  title: string;
  description: string;
  invitedMembers: CalendarMember[];
  color?: Color;
  date?: Date;
  deadline: Deadline;
  allDay: boolean;
  owner: User;
  createdDate: Date;
  updatedDate: Date;
  calendar: Calendar;

  constructor(id: string, title: string, description: string, invitedMembers: CalendarMember[], color: Color, date: Date, deadline: Deadline, allDay: boolean, owner: User, createdDate: Date, updatedDate: Date, calendar: Calendar) {
    this._id = id;
    this.title = title;
    this.description = description;
    this.invitedMembers = invitedMembers;
    this.color = color;
    this.date = date;
    this.deadline = deadline;
    this.allDay = allDay;
    this.owner = owner;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.calendar = calendar;
  }
}

export class NewCalendarEvent {
  @Length(3, 64)
  title: string;

  @Length(0, 4096)
  description: string;

  allDay: boolean;

  multipleDay: boolean;

  invitedMembers: string[];
  color?: Color;
  date?: Date;
  deadline?: Deadline;

  constructor(title: string, description: string, invitedMembers: string[], color: Color, allDay: boolean, multipleDay: boolean, date?: Date, deadline?: Deadline) {
    this.title = title;
    this.description = description;
    this.invitedMembers = invitedMembers;
    this.allDay = allDay;
    this.multipleDay = multipleDay;
    this.color = color;
    this.date = date;
    this.deadline = deadline;
  }
}

export class EventUpdateBody {
  title?: string;
  description?: string;
  color?: string;
  deadline?: Deadline;

  constructor(title: string, description: string, color: string, deadline: Deadline) {
    this.title = title;
    this.description = description;
    this.color = color;
    this.deadline = deadline;
  }
}
