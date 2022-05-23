import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DattedObjectSchema} from "../utility/datted_object.utility";

export type UserDocument = User & Document;

@Schema({versionKey: false})
export class User extends DattedObjectSchema {

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  roles: string[];

}

export const UserSchema = SchemaFactory.createForClass(User)
