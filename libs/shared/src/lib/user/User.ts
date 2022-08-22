import {DatedObject} from "../DatedObject";
import {Device} from "./Device";

export type User = {
  _id: string;
  email: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  domain?: string[];
  devices: Device[];
} & DatedObject

export enum UserDomain {
  MOBILE = 'Mobile',
  SERVER = 'Server',
  WEB = 'Web',
  OTHER = 'Autre',
}
