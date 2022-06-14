import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../user/user.schema";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {DodStatus} from "../../../../../libs/data-access/dod/Dod";
import {DodColor} from "../../../../../libs/data-access/organization/Organization";

export type OrganizationDocument = Organization & Document;

const defaultDodColors: DodColor[] = [
  {
    name: 'En cours',
    color: 'FBBC04'
  },
  {
    name: 'A faire',
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

export type DodColorPref = {
  type: DodStatus,
  color: string
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

  @Prop({required: false, default: defaultDodColors})
  dodColors?: DodColor[];

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
