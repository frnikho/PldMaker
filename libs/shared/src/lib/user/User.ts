import {DatedObject} from "../DatedObject";
import {Device} from "./Device";
import { Timezone } from "@pld/utils";

export type User = {
  _id: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  domain?: string[];
  roles?: string[];
  devices: Device[];
  timezone: Timezone;
} & DatedObject

export enum UserDomain {
  MOBILE = 'Mobile',
  SERVER = 'Server',
  WEB = 'Web',
  OTHER = 'Autre',
}
