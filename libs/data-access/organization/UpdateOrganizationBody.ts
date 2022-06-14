import {DodColor} from "./Organization";

export type UpdateOrganizationBody = {
  orgId: string;
  name?: String;
  description?: String;
  versionShifting?: number;
  dodColors?: DodColor[];
}
