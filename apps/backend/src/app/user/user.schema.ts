import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {Document} from "mongoose";
import {Device, Gender, Mobile, UserDomain} from "@pld/shared";

export type UserDocument = User & Document;

@Schema()
export class User extends DatedObjectSchema {

  @Prop({required: true, validators: {validator: (value) => Promise.resolve(value.length > 4),
      message: 'Password validation failed'}})
  email: string;

  @Prop({select: false, required: true, minlength: 5})
  password: string;

  @Prop({required: true})
  roles: string[];

  @Prop({required: false, default: undefined})
  firstname?: string;

  @Prop({required: false, default: undefined})
  lastname?: string;

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

  @Prop({required: true, enum: Gender})
  gender?: string;

}

export const UserSchema = SchemaFactory.createForClass(User)
