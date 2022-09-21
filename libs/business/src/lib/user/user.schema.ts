import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import mongoose, {Document} from "mongoose";
import { Device, Gender, Mobile, UserDomain } from "@pld/shared";
import { Mfa } from "../auth/mfa/mfa.schema";
import { Timezone } from "@pld/utils";

export type UserDocument = User & Document;

@Schema()
export class User extends DatedObjectSchema {

  @Prop({required: true, validators: {validator: (value) => Promise.resolve(value.length > 4),
      message: 'Password validation failed'}})
  email: string;

  @Prop({select: false, required: true, minlength: 5})
  password: string;

  @Prop({required: false, default: ['user']})
  roles: string[];

  @Prop({required: true, minlength: 2, maxlength: 32})
  firstname: string;

  @Prop({required: true, minlength: 2, maxlength: 32})
  lastname: string;

  @Prop({required: false, default: UserDomain.MOBILE})
  domain?: string[];

  @Prop({required: false, default: []})
  devices: Device[];

  @Prop({required: false, default: 'default-1'})
  profile_picture?: string;

  @Prop({required: false})
  job_title?: string;

  @Prop({required: false})
  department?: string;

  @Prop({required: false})
  organization?: string;

  @Prop({required: false})
  location?: string;

  @Prop({required: false})
  mobile?: Mobile;

  @Prop({required: false})
  language?: string;

  @Prop({required: false, enum: Gender})
  gender?: string;

  @Prop({required: false, default: [], type: [{ type: mongoose.Schema.Types.ObjectId }], ref: 'Mfa'})
  mfa: Mfa[];

  @Prop({required: false, default: Timezone["Europe/Paris"], enum: Timezone})
  timezone: string;

}

export const UserSchema = SchemaFactory.createForClass(User)

export const UserDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
}
