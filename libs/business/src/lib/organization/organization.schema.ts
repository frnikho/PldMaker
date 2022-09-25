import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document, ObjectId} from "mongoose";
import {User} from "../user/user.schema";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import { DodStatus } from "@pld/shared";
import {OrgHistoryAction} from "@pld/shared";
import { OrganizationSection } from "./section/organization-section.schema";

export type OrganizationDocument = Organization & Document;

export type NewOrgHistory = {
  date: Date;
  owner: string | ObjectId;
  action: string;
  member?: string | ObjectId;
}

@Schema()
export class OrgHistory {

  @Prop({default: new Date()})
  date: Date;

  @Prop({required: true, ref: User.name, type: mongoose.Schema.Types.ObjectId})
  owner: User;

  @Prop({required: true, enum: OrgHistoryAction})
  action: string;

  @Prop({required: false, ref: User.name, type: mongoose.Schema.Types.ObjectId})
  member?: User;
}

@Schema()
export class Organization extends DatedObjectSchema {

  @Prop({required: true})
  name: string;

  @Prop({required: false, default: ''})
  description: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []})
  members: User[];

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  owner: User;

  @Prop({required: false, default: 1.0})
  versionShifting: number;

  @Prop({default: []})
  history: OrgHistory[];

  @Prop({required: false, default: [], ref: 'OrganizationSection', type: [{type: mongoose.Schema.Types.ObjectId}]})
  sections: OrganizationSection[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

export const OrganizationDefinition: ModelDefinition = {
  name: Organization.name,
  schema: OrganizationSchema
}
