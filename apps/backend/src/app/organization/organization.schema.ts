import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import { User } from "../user/user.schema";
import { DatedObjectSchema } from "../utility/datted_object.utility";

export type OrganizationDocument = Organization & Document;

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

  @Prop({default: 1.0})
  versionShifting?: number;

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
