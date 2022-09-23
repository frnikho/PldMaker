import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../user/user.schema";
import {Pld} from "../pld/pld.schema";
import {DodStatus} from "@pld/shared";
import {DodHistoryAction} from "@pld/shared";
import { DatedObjectSchema } from "../utility/datted_object.utility";
import { dodRules } from "./dod.rule";

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

  @Prop(dodRules.version)
  version: string;

  @Prop(dodRules.title)
  title: string;

  @Prop(dodRules.skinOf)
  skinOf: string;

  @Prop(dodRules.want)
  want: string;

  @Prop(dodRules.description)
  description: string;

  @Prop(dodRules.descriptionOfDone)
  descriptionOfDone: string[];

  @Prop(dodRules.estimatedWorkTime)
  estimatedWorkTime: EstimatedWorkTime[];

  @Prop(dodRules.pldOwner)
  pldOwner: Pld;

  @Prop(dodRules.status)
  status: DodStatus;

  @Prop(dodRules.owner)
  owner: User;

  @Prop(dodRules.history)
  history: DodHistory[];

}

export const DodSchema = SchemaFactory.createForClass(Dod);

export const DodDefinition: ModelDefinition = {
  name: Dod.name,
  schema: DodSchema,
}
