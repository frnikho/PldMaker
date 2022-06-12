import {DatedObject} from "../DatedObject";
import {User} from "../user/User";
import {DodStatus} from "../pld/dod/Dod";

export type Organization = {
  members: User[],
  name: string;
  owner: User;
  description: string;
  versionShifting: number;
  _id: string;
  preferences: OrganizationPreferences;
} & DatedObject

export type DodColorPref = {
  type: DodStatus,
  color: string
}

export class OrganizationPreferences {
  dodColors: DodColorPref[];

  constructor(dodColors: DodColorPref[]) {
    this.dodColors = dodColors;
  }
}
