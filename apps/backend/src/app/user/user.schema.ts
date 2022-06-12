import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {Document} from "mongoose";

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

}

export const UserSchema = SchemaFactory.createForClass(User)
