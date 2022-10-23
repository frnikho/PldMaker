import {Gender} from "./Gender";
import {Mobile} from "../Mobile";
import { Timezone } from "@pld/utils";
import { IsEmail, IsNotEmpty, IsOptional, Length, MaxLength, MinLength } from "class-validator";

export class UpdateUserBody {

  @IsOptional()
  @Length(2, 32)
  firstname?: string;

  @IsOptional()
  @Length(2, 32)
  lastname?: string;

  @IsOptional()
  domain?: string[];

  @IsOptional()
  gender?: Gender;

  @IsOptional()
  job_title?: string;

  @IsOptional()
  department?: string;

  @IsOptional()
  organization?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  mobile?: Mobile;

  @IsOptional()
  language?: string;

  @IsOptional()
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


export class UpdateUserPassword {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  token: string;

  @MinLength(6)
  @MaxLength(128)
  newPassword: string;

  constructor(email: string, token: string, newPassword: string) {
    this.newPassword = newPassword;
    this.email = email;
    this.token = token;
  }
}
