import { Organization } from "../organization/Organization";
import { Length, IsOptional } from "class-validator";

export class DodStatus {

  _id: string;
  name: string;
  color: string;
  useDefault: boolean;
  org: Organization;
  createdDate: Date;
  updatedDate: Date;

  constructor(id: string, name: string, useDefault: boolean, color: string, org: Organization, createdDate: Date, updatedDate: Date) {
    this._id = id;
    this.name = name;
    this.useDefault = useDefault;
    this.color = color;
    this.org = org;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}

export class NewDodStatus {
  @Length(2, 32)
  name: string;

  @Length(6, 6)
  color: string;

  useDefault: boolean;

  constructor(name: string, color: string, useDefault: boolean) {
    this.name = name;
    this.color = color;
    this.useDefault = useDefault;
  }
}

export class UpdateDodStatus {
  @IsOptional()
  @Length(2, 32)
  name?: string;

  @IsOptional()
  @Length(6, 6)
  color?: string;

  @IsOptional()
  useDefault?: boolean;

  constructor(name?: string, color?: string, useDefault?: boolean) {
    this.name = name;
    this.color = color;
    this.useDefault = useDefault;
  }
}
