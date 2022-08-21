import {DatedObjectSchema} from "../utility/datted_object.utility";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {TemplateData} from "@pld/shared";
import {User} from "../user/user.schema";
import {Organization} from "../organization/organization.schema";

export type TemplateDocument = Template & Document;

@Schema()
export class Template extends DatedObjectSchema {

  @Prop({required: true, default: 'Nouveau template'})
  name: string;

  @Prop({required: true, type: TemplateData})
  data: TemplateData;

  @Prop({required: false, default: false})
  default: boolean;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name})
  owner: User;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: Organization.name})
  org: Organization;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);
