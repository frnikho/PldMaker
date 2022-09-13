import mongoose, { Document } from "mongoose";
import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Organization, User } from "@pld/shared";

export type OrganizationSectionDocument = OrganizationSection & Document;

@Schema({versionKey: false})
export class OrganizationSection extends Document {

  @Prop({unique: true})
  section: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true, ref: 'Organization', type: mongoose.Schema.Types.ObjectId})
  org: Organization;

  @Prop({required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId})
  owner: User;

  @Prop({required: false, default: new Date()})
  createdDate: Date;

  @Prop({required: false, default: new Date()})
  updatedDate: Date;
}

export const OrganizationSectionSchema = SchemaFactory.createForClass(OrganizationSection);

export const OrganizationSectionDefinition: ModelDefinition = {
  name: OrganizationSection.name,
  schema: OrganizationSectionSchema,
};
