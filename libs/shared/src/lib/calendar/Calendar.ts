import { User } from "../user/User";

export enum EventType {
  Available = 'Disponible',
  Busy = 'Occupé',
}

export class Event {
  id: string;
  start: Date;
  end: Date;
  type: EventType;

  constructor(id: string, start: Date, end: Date, type: EventType) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.type = type;
  }
}

export class PersonalCalendar {
  owner: User;
  events: Event[];
  createdDate: Date;
  updatedDate: Date;

  constructor(owner: User, events: Event[], createdDate: Date, updatedDate: Date) {
    this.owner = owner;
    this.events = events;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}

export class SavePersonalCalendar {
  events: Event[];

  constructor(events: Event[]) {
    this.events = events;
  }
}
