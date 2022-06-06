import {DatedObject} from "../DatedObject";
import {PldOwnerType} from "./PldOwnerType";
import {PldStatus} from "./PldStatus";
import {User} from "../user/User";
import {Organization} from "../organization/Organization";

export type Pld = {
  description: string;
  manager: string;
  owner: User | Organization;
  ownerType: PldOwnerType;
  promotion: number;
  revisionsUpdated: unknown[];
  status: PldStatus;
  tags: string[];
  title: string;
  version: number;
  _id: string;
} & DatedObject
