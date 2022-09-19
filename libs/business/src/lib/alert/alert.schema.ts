import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AlertAction, AlertPosition, User } from "@pld/shared";
import mongoose from "mongoose";
import { Deadline } from "@pld/utils";

@Schema({versionKey: false})
export class Alert {

  @Prop({required: true, maxlength: 128})
  title: string;

  @Prop({required: true, maxlength: 2048})
  content: string;

  @Prop({unique: true})
  key: string;

  @Prop({required: true})
  enable: boolean;

  @Prop({required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId})
  owner: User;

  @Prop({required: true, enum: AlertPosition})
  position: string;

  @Prop({required: false, default: []})
  action: AlertAction[];

  @Prop({required: false, default: undefined})
  deadline?: Deadline;

  @Prop({required: false, default: new Date()})
  createdDate: Date;

  @Prop({required: false, default: new Date()})
  updatedDate: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

export const AlertDefinition: ModelDefinition = {
  name: Alert.name,
  schema: AlertSchema,
}
