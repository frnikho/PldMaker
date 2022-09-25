import mongoose from "mongoose";
import {User} from "../user/user.schema";
import {Pld} from "../pld/pld.schema";
import { DodStatus } from "@pld/shared";

declare type PropOptions<T = any> = Partial<mongoose.SchemaDefinitionProperty<T>> | mongoose.SchemaType;

export type DodRulesType = {
  version: PropOptions;
  title: PropOptions;
  skinOf: PropOptions;
  want: PropOptions;
  description: PropOptions;
  descriptionOfDone: PropOptions;
  estimatedWorkTime: PropOptions;
  pldOwner: PropOptions;
  status: PropOptions;
  owner: PropOptions;
  history: PropOptions;
}

export const dodRules: DodRulesType = {
  version: {
    required: true,
    maxlength: 32,
    minlength: 2,
    match: new RegExp('[0-9]+\\..*\\.[0-9]+')
  },
  title: {
    minlength: 3,
    maxlength: 32,
    required: true
  },
  skinOf: {
    maxlength: 64,
    minlength: 2,
    required: true,
  },
  want: {
    maxlength: 64,
    minlength: 2,
    required: true,
  },
  history: {
    required: false,
    default: []
  },
  description: {
    maxlength: 512,
    required: true
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name
  },
  descriptionOfDone: {
    required: true
  },
  status: {
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DodStatus'
  },
  estimatedWorkTime: {
    required: true
  },
  pldOwner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Pld.name
  }
}
