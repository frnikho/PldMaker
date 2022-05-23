import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {DattedObject} from "../utility/datted_object.utility";

@Schema({versionKey: false})
export class User extends DattedObject {

  @Prop()
  uuid: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User)
