import {Gender} from "./Gender";
import {Mobile} from "../Mobile";
import { Timezone } from "@pld/utils";

export class UpdateUserBody {
  firstname?: string;
  lastname?: string;
  domain?: string[];
  gender?: Gender;
  job_title?: string;
  department?: string;
  organization?: string;
  location?: string;
  mobile?: Mobile;
  language?: string;
  timezone?: Timezone;

  constructor(firstname?: string, lastname?: string, domain?: string[], gender?: Gender, job_title?: string, department?: string, organization?: string, location?: string, mobile?: Mobile, language?: string, timezone?: Timezone) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.domain = domain;
    this.gender = gender;
    this.job_title = job_title;
    this.department = department;
    this.organization = organization;
    this.location = location;
    this.mobile = mobile;
    this.language = language;
    this.timezone = timezone;
  }
}
