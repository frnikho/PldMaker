import {Deadline} from "@pld/utils";
import {CalendarEvent} from "./CalendarEvent";
import {Pld} from "../../pld/Pld";
import {Length} from "class-validator";
import { Organization } from "../Organization";

export class Calendar {
  _id: string;
  name: string;
  description: string;
  deadline?: Deadline;
  createdDate: Date;
  updatedDate: Date;
  org: Organization;
  events: CalendarEvent;
  linkedPld: Pld[];

  constructor(_id: string, name: string, description: string, org: Organization, deadline: Deadline, createdDate: Date, updatedDate: Date, events: CalendarEvent, linkedPld: Pld[]) {
    this._id = _id;
    this.name = name;
    this.linkedPld = linkedPld;
    this.description = description;
    this.deadline = deadline;
    this.org = org;
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

  constructor(name: string, description: string, deadline?: Deadline) {
    this.name = name;
    this.description = description;
    this.deadline = deadline;
  }
}
