import {Color, Deadline} from "@pld/utils";
import {User} from "../../user/User";
import {Length} from "class-validator";
import { CalendarMember } from "./CalendarMember";

export class CalendarEvent {
  _id: string;
  title: string;
  description: string;
  invitedMembers: CalendarMember[];
  color?: Color;
  date?: Date;
  deadline?: Deadline;
  allDay: boolean;
  owner: User;
  createdDate: Date;
  updatedDate: Date;

  constructor(_id: string, title: string, description: string, allDay: boolean, invitedMembers: CalendarMember[], color: Color, date: Date, deadline: Deadline, owner: User, createdDate: Date, updatedDate: Date) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.allDay = allDay;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.invitedMembers = invitedMembers;
    this.color = color;
    this.date = date;
    this.deadline = deadline;
    this.owner = owner;
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
