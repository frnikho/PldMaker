import mongoose from "mongoose";
import { AlertPosition } from "@pld/shared";

declare type PropOptions<T = any> = Partial<mongoose.SchemaDefinitionProperty<T>> | mongoose.SchemaType;

type AlertRules = 'target' | 'title' | 'content' | 'key' | 'enable' | 'owner' | 'position' | 'action' | 'deadline' | 'createdDate' | 'updatedDate';

export type AlertRulesType = {
  [key in AlertRules]: PropOptions;
}

export const alertRules: AlertRulesType = {
  title: {
    required: true,
    maxlength: 128,
  },
  content: {
    required: true,
    maxlength: 2048,
  },
  key: {
    unique: true,
  },
  enable: {
    required: true
  },
  owner: {
    required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId
  },
  position: {
    required: true,
    enum: AlertPosition
  },
  action: {
    required: false,
    default: []
  },
  target: {
    required: false,
    default: undefined,
  },
  deadline: {
    required: false,
    default: undefined,
  },
  createdDate: {
    required: false,
    default: new Date()
  },
  updatedDate: {
    required: false,
    default: new Date()
  }
}
