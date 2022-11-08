import { DodStatus } from "@pld/shared";

export const getDodStatusColor = (dodStatus: DodStatus[], status: string) => {
  const color: DodStatus | undefined = dodStatus.find((dodStatus) => {
    return dodStatus.name === status
  });
  if (color === undefined) {
    return 'ababab';
  }
  return color.color;
}
