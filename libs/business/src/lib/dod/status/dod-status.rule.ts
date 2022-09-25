import mongoose from "mongoose";

declare type PropOptions<T = any> = Partial<mongoose.SchemaDefinitionProperty<T>> | mongoose.SchemaType;

type DodStatusRules = 'name' | 'color' | 'org' | 'createdDate' | 'updatedDate' | 'useDefault';

export type DodStatusRulesType = {
  [key in DodStatusRules]: PropOptions;
}

export const dodStatusRules: DodStatusRulesType = {
  name: {
    required: true,
    maxlength: 32,
    minlength: 2,
  },
  color: {
    required: true,
    maxlength: 6,
    minlength: 6,
  },
  createdDate: {
    required: false,
    default: new Date(),
  },
  updatedDate: {
    required: false,
    default: new Date(),
  },
  org: {
    required: true,
    ref: 'Organization',
    type: mongoose.Schema.Types.ObjectId,
  },
  useDefault: {
    required: false,
    default: false,
  }
}
