import {DodStatus} from "../../../../../libs/data-access/dod/Dod";
import {DodColor} from "../../../../../libs/data-access/organization/Organization";

export const getDodStatusColor = (dodColors: DodColor[], status: DodStatus) => { //TODO REWORK THIS !!!
  const color: DodColor | undefined = dodColors.find((dodColor) => dodColor.name === status);
  if (color === undefined)
    return '';
  return color.color;
}
