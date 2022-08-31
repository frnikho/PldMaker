import {Color, Deadline} from "@pld/utils";
import {CalendarMember} from "./CalendarMember";

export class CalendarEvent {
  title: string;
  description: string;
  invitedMembers: CalendarMember[];
  color?: Color;
  date?: Date;
  deadline?: Deadline;

  constructor(title: string, description: string, invitedMembers: CalendarMember[], color: Color, date: Date, deadline: Deadline) {
    this.title = title;
    this.description = description;
    this.invitedMembers = invitedMembers;
    this.color = color;
    this.date = date;
    this.deadline = deadline;
  }
}
