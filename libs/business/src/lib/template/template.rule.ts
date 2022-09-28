import mongoose from "mongoose";
import { defaultTemplateDod, defaultTemplateHeader, defaultTemplateResume, defaultTemplateRevision } from "@pld/shared";

declare type PropOptions<T = any> = Partial<mongoose.SchemaDefinitionProperty<T>> | mongoose.SchemaType;

type TemplateRules = 'owner' | 'org' | 'title' | 'useAsDefault' | 'dodTemplate' | 'resumeTemplate' | 'revisionTemplate' | 'headerTemplate' | 'createdDate' | 'updatedDate';

export type TemplateRuleType = {
  [key in TemplateRules]: PropOptions;
}

export const templateRules: TemplateRuleType = {
  owner: {
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
  org: {
    required: true,
    ref: 'Organization',
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    required: true,
    maxlength: 128,
    minlength: 3,
  },
  dodTemplate: {
    required: false,
    default: defaultTemplateDod,
  },
  headerTemplate: {
    required: false,
    default: defaultTemplateHeader,
  },
  resumeTemplate: {
    required: false,
    default: defaultTemplateResume,
  },
  revisionTemplate: {
    required: false,
    default: defaultTemplateRevision,
  },
  useAsDefault: {
    required: false,
    default: false,
  },
  createdDate: {
    required: false,
    default: new Date(),
  },
  updatedDate: {
    required: false,
    default: new Date(),
  }
}
