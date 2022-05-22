import {DattedObject} from "./DattedObject";

export type User = {
  uuid?: string;
  email: string;
  password?: string;
} & DattedObject
