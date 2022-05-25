import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {User} from "../user/user.schema";
import {Organization} from "../organization/organization.schema";

export type PldDocument = Pld & Document;

@Schema()
export class Pld extends DatedObjectSchema {

  @Prop({required: true})
  name: string;

  @Prop({required: false, default: ''})
  description: string;

  @Prop({default: 1.0})
  version: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, refPath: 'ownerType'})
  owner: User | Organization;

  @Prop({type: String, required: true, enum: ['User', 'Organization']})
  ownerType: string;

}

export const PldSchema = SchemaFactory.createForClass(Pld);
