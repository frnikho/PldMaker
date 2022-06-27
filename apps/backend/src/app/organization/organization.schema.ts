import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, ObjectId} from "mongoose";
import {User} from "../user/user.schema";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {DodColor} from "../../../../../libs/data-access/organization/Organization";
import {OrgHistoryAction} from "../../../../../libs/data-access/organization/OrgHistory";

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

const defaultDodColors: DodColor[] = [
  {
    name: 'En cours',
    color: 'FBBC04'
  },
  {
    name: 'À faire',
    color: '2D9BF0'
  },
  {
    name: 'Fini',
    color: '77b243'
  },
  {
    name: 'Non fini',
    color: 'F08080'
  }
];

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

  @Prop({required: false, default: defaultDodColors})
  dodColors?: DodColor[];

  @Prop({default: []})
  history: OrgHistory[]

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
