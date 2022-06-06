import {DatedObject} from "../DatedObject";
import {User} from "../user/User";

export type Organization = {
  members: string[] | User[],
  name: string;
  owner: string | User;
  description: string;
  versionShifting: number;
  _id: string;
} & DatedObject
