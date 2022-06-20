import {DodColor} from "../../../../../libs/data-access/organization/Organization";

export const getDodStatusColor = (dodColors: DodColor[], status: string) => {
  const color: DodColor | undefined = dodColors.find((dodColor) => {
    return dodColor.name === status
  });
  if (color === undefined) {
    console.log(status);
    return 'ababab';
  }
  return color.color;
}
