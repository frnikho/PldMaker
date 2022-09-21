import mongoose, {Document} from "mongoose";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Deadline} from "@pld/utils";
import {Pld} from "../../pld/pld.schema";
import {User} from "../../user/user.schema";
import {Organization} from "../organization.schema";

@Schema({versionKey: false})
export class Calendar extends Document {

  @Prop({required: true, maxlength: 52, minlength: 3})
  name: string;

  @Prop({required: false, maxlength: 256, default: ''})
  description: string;

  @Prop({required: false})
  deadline?: Deadline;

  @Prop({required: false, default: []})
  linkedPld: Pld[];

  @Prop({required: false, default: new Date()})
  createdDate: Date;

  @Prop({required: false, default: new Date()})
  updatedDate: Date;

  @Prop({required: true, ref: User.name, type: mongoose.Schema.Types.ObjectId})
  owner: User;

  @Prop({required: true, ref: Organization.name, type: mongoose.Schema.Types.ObjectId})
  org: Organization;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);

export const CalendarDefinition: ModelDefinition = {
  name: Calendar.name,
  schema: CalendarSchema
}
