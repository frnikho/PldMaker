import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Event, User } from "@pld/shared";
import { calendarRule } from "./calendar.rule";

@Schema({versionKey: false, collection: 'personalCalendar'})
export class PersonalCalendar {
  @Prop(calendarRule.owner)
  owner: User;

  @Prop(calendarRule.events)
  events: Event[];

  @Prop(calendarRule.createdDate)
  createdDate: Date;

  @Prop(calendarRule.updatedDate)
  updatedDate: Date;
}

export const PersonalCalendarSchema = SchemaFactory.createForClass(PersonalCalendar);

export const PersonalCalendarDefinition: ModelDefinition = {
  name: PersonalCalendar.name,
  schema: PersonalCalendarSchema,
}
