import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Event, User } from "@pld/shared";

@Schema({versionKey: false, collection: 'personalCalendar'})
export class PersonalCalendar {
  @Prop()
  owner: User;

  @Prop()
  events: Event[];

  @Prop()
  createdDate: Date;

  @Prop()
  updatedDate: Date;
}

export const PersonalCalendarSchema = SchemaFactory.createForClass(PersonalCalendar);

export const PersonalCalendarDefinition: ModelDefinition = {
  name: PersonalCalendar.name,
  schema: PersonalCalendarSchema,
}
