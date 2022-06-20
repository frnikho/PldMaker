import {TemplateData} from "../Template";
import {Organization} from "../organization/Organization";
import {User} from "../user/User";
import {DatedObject} from "../DatedObject";

export type Template = {
  _id: string;
  owner: User;
  Org: Organization;
  default: boolean;
} & DatedObject;

export type TemplateBody = {
  pldId: string;
  orgId: string;
  data: TemplateData;
  default: boolean;
  name: string
}
