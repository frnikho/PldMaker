import {Deadline} from "@pld/utils";
import {CalendarEvent} from "./CalendarEvent";
import {Pld} from "../../pld/Pld";
import {Length} from "class-validator";

export class Calendar {
  name: string;
  description: string;
  deadline?: Deadline;
  createdDate: Date;
  updatedDate: Date;
  events: CalendarEvent;
  linkedPld: Pld[];

  constructor(name: string, description: string, deadline: Deadline, createdDate: Date, updatedDate: Date, events: CalendarEvent, linkedPld: Pld[]) {
    this.name = name;
    this.linkedPld = linkedPld;
    this.description = description;
    this.deadline = deadline;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.events = events;
  }
}

export class NewCalendarBody {
  @Length(3, 32)
  name: string;

  @Length(0, 256)
  description: string;

  deadline?: Deadline;

  linkedPld: string[];

  constructor(name: string, description: string, deadline: Deadline, linkedPld: string[]) {
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.linkedPld = linkedPld;
  }
}
