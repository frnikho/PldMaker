import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../user/user.schema";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {DodStatus} from "../../../../../libs/data-access/pld/dod/Dod";

export type OrganizationDocument = Organization & Document;

export class OrganizationPreferences {
  dodColors: DodColorPref[]
}

const defaultPreferences: OrganizationPreferences = {
  dodColors: [
    {
      type: DodStatus.DOING,
      color: 'FBBC04'
    },
    {
      type: DodStatus.TO_TRY,
      color: '1ABC9C'
    },
    {
      type: DodStatus.TODO,
      color: '2D9BF0'
    },
    {
      type: DodStatus.DONE,
      color: '77b243'
    },
    {
      type: DodStatus.NOT_FINISH,
      color: 'F08080'
    }
  ],
}

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

  @Prop({required: false, default: defaultPreferences})
  preferences: OrganizationPreferences;

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
