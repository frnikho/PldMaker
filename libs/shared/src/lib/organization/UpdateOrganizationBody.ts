import {DodColor} from "./Organization";

export type UpdateOrganizationBody = {
  orgId: string;
  name?: string;
  description?: string;
  versionShifting?: number;
  dodColors?: DodColor[];
}
