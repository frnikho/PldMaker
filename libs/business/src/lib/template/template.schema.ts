import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import { TemplateData, TemplateDod, TemplateHeader, TemplateResume, TemplateRevision } from "@pld/shared";
import { User } from "../user/user.schema";
import { Organization } from "../organization/organization.schema";
import { DatedObjectSchema } from "../utility/datted_object.utility";
import { templateRules } from "./template.rule";

export type TemplateDocument = Template & Document;

@Schema()
export class Template extends DatedObjectSchema {

  @Prop(templateRules.title)
  title: string;

  @Prop(templateRules.owner)
  owner: User;

  @Prop(templateRules.org)
  org: Organization;

  @Prop(templateRules.useAsDefault)
  useAsDefault: boolean;

  @Prop(templateRules.dodTemplate)
  dodTemplate: TemplateDod;

  @Prop(templateRules.resumeTemplate)
  resumeTemplate: TemplateResume;

  @Prop(templateRules.revisionTemplate)
  revisionTemplate: TemplateRevision;

  @Prop(templateRules.headerTemplate)
  headerTemplate: TemplateHeader;

  @Prop(templateRules.createdDate)
  createdDate: Date;

  @Prop(templateRules.updatedDate)
  updatedDate: Date;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);

export const TemplateDefinition: ModelDefinition = {
  name: Template.name,
  schema: TemplateSchema,
}
