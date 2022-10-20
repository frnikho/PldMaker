import mongoose from "mongoose";
import { defaultTemplateColor, defaultTemplateDod, defaultTemplateReport, defaultTemplateDescription, defaultTemplateRevision } from "@pld/shared";
import { PropOptions } from "@nestjs/mongoose";
import { getTemplatePicture } from "../utility/picture.utility";

type TemplateRules = 'owner' | 'org' | 'title' | 'picture' | 'useAsDefault' | 'dodTemplate' | 'reportTemplate' | 'revisionTemplate' | 'colorTemplate' | 'descriptionTemplate' | 'createdDate' | 'updatedDate';

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
  picture: {
    required: false,
    default: () => process.env.NX_SERVER_HOST + 'assets/' + getTemplatePicture(),
  },
  dodTemplate: {
    required: false,
    default: defaultTemplateDod,
  },
  descriptionTemplate: {
    required: false,
    default: defaultTemplateDescription,
  },
  colorTemplate: {
    required: false,
    default: defaultTemplateColor,
  },
  reportTemplate: {
    required: false,
    default: defaultTemplateReport,
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
