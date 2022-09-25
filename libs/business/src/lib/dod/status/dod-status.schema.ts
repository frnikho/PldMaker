import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Organization } from "@pld/shared";
import { dodStatusRules } from "./dod-status.rule";

@Schema({versionKey: false})
export class DodStatus {

  @Prop(dodStatusRules.name)
  name: string;

  @Prop(dodStatusRules.color)
  color: string;

  @Prop(dodStatusRules.org)
  org: Organization;

  @Prop(dodStatusRules.createdDate)
  createdDate: Date;

  @Prop(dodStatusRules.updatedDate)
  updatedDate: Date;

  @Prop(dodStatusRules.useDefault)
  useDefault: boolean;
}

export const DodStatusSchema = SchemaFactory.createForClass(DodStatus);

export const DodStatusDefinition: ModelDefinition = {
  name: DodStatus.name,
  schema: DodStatusSchema,
}
