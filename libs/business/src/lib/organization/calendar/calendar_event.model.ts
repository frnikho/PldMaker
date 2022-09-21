import mongoose, {Document} from "mongoose";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {CalendarMemberStatus} from "@pld/shared";
import {Deadline} from "@pld/utils";
import { User } from "../../user/user.schema";
import { Calendar } from "./calendar.model";

@Schema({versionKey: false})
export class CalendarMember extends Document {
  @Prop({ref: User.name, type: mongoose.Schema.Types.ObjectId})
  user: User;

  @Prop({enum: CalendarMemberStatus})
  status: string;
}

@Schema({versionKey: false})
export class CalendarEvent extends Document {
  @Prop({required: true})
  title: string;

  @Prop({required: false})
  description: string;

  @Prop({required: false, default: []})
  invitedMembers: CalendarMember[];

  @Prop({required: false, default: '#27ae60'})
  color?: string;

  @Prop({required: false})
  date?: Date;

  @Prop({required: true})
  allDay: boolean;

  @Prop({required: false})
  deadline?: Deadline;

  @Prop({required: true, ref: Calendar.name, type: mongoose.Schema.Types.ObjectId})
  calendar: Calendar;

  @Prop({required: true, ref: User.name, type: mongoose.Schema.Types.ObjectId})
  owner: User;

  @Prop({required: false, default: new Date()})
  createdDate: Date;

  @Prop({required: false, default: new Date()})
  updatedDate: Date;
}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);

export const CalendarEventDefinition: ModelDefinition = {
  name: CalendarEvent.name,
  schema: CalendarEventSchema
}
