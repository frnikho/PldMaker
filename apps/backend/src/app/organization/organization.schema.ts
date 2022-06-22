import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../user/user.schema";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {DodColor} from "../../../../../libs/data-access/organization/Organization";
import {Dod} from "../dod/dod.schema";
import {Pld} from "../pld/pld.schema";

export type OrganizationDocument = Organization & Document;

@Schema()
export class OrgHistory {
  @Prop({enum: [Dod.name, Pld.name]})
  type: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, refPath: 'type'})
  data: Dod | Pld;

  @Prop({default: new Date()})
  date: Date;

  @Prop({required: true, ref: User.name, type: mongoose.Schema.Types.ObjectId})
  owner: User;

  @Prop({required: true})
  action: string;
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
  history?: OrgHistory[]

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
