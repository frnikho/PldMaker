import {DatedObject} from "../DatedObject";
import {User} from "../user/User";

export type Organization = {
  members: User[],
  name: string;
  owner: User;
  description: string;
  versionShifting: number;
  _id: string;
  dodColors: DodColor[];
} & DatedObject

export type DodColor = {
  name: string;
  color: string;
}
