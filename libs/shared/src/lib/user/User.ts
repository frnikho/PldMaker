import {Device} from "./Device";
import { Timezone } from "@pld/utils";
import { Preference } from "./Preference";

export class User {
  _id: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  domain: UserDomain[];
  roles?: string[];
  devices: Device[];
  profile_picture: string;
  timezone: Timezone;
  created_date: Date;
  updated_date: Date;
  preference: Preference;

  constructor(id: string, email: string, password: string, firstname: string, profile_picture: string, lastname: string, domain: UserDomain[], roles: string[], devices: Device[], timezone: Timezone, created_date: Date, updated_date: Date, preference: Preference) {
    this._id = id;
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.domain = domain;
    this.roles = roles;
    this.devices = devices;
    this.timezone = timezone;
    this.created_date = created_date;
    this.updated_date = updated_date;
    this.profile_picture = profile_picture;
    this.preference = preference;
  }
}

export enum UserDomain {
  MOBILE = 'Mobile',
  SERVER = 'Server',
  WEB = 'Web',
  DEVOPS = 'DevOps',
  CLOUD = 'Cloud',
  VPS = 'Vps',
  OTHER = 'Autre',
}
