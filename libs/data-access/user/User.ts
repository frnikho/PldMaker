import {DatedObject} from "../DatedObject";

export type User = {
  _id: string;
  email: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  domain?: string[];
} & DatedObject

export enum UserDomain {
  MOBILE = 'Mobile',
  SERVER = 'Server',
  WEB = 'Web',
  OTHER = 'Autre',
}
