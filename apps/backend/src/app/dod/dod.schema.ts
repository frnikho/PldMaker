import {DatedObjectSchema} from "../utility/datted_object.utility";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../user/user.schema";
import {Pld} from "../pld/pld.schema";
import {DodStatus} from "@pld/shared";
import {DodHistoryAction} from "@pld/shared";

export type DodDocument = Dod & Document;

export type EstimatedWorkTime = {

  time: string;

  format: EstimatedWorkTimeFormat;

  author: User[];
}

export enum EstimatedWorkTimeFormat {
  JOUR_HOMME = 'J/H',
  HOURS = 'Heures',
}

export type EditedField = {
  name: string;
  lastValue: string;
  value: string;
}

export type NewDodHistory = {
  dodId: string;
  editedFields: EditedField[];
  owner: string;
  action: DodHistoryAction;
}

@Schema()
export class DodHistory {
  @Prop({required: true})
  date: Date;

  @Prop({required: false, default: []})
  editedFields: EditedField[]

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name})
  owner: User;

  @Prop({required: true, enum: DodHistoryAction})
  action: string;
}

@Schema()
export class Dod extends DatedObjectSchema {

  @Prop({required: true})
  version: string;

  @Prop({required: true})
  title: string;

  @Prop({required: true})
  skinOf: string;

  @Prop({required: true})
  want: string;

  @Prop({required: true})
  description: string;

  @Prop({required: true})
  descriptionOfDone: string[];

  @Prop({required: true})
  estimatedWorkTime: EstimatedWorkTime[];

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: Pld.name})
  pldOwner: Pld;

  @Prop({type: String, enum: DodStatus, default: DodStatus.TODO})
  status: DodStatus;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name})
  owner: User;

  @Prop({required: false, default: []})
  history: DodHistory[];

}

export const DodSchema = SchemaFactory.createForClass(Dod);

export const DodDefinition: ModelDefinition = {
  name: Dod.name,
  schema: DodSchema,
}
