import { DodStatus } from "@pld/shared";

export const getDodStatusColor = (dodStatus: DodStatus[], status: string) => {
  const color: DodStatus | undefined = dodStatus.find((dodStatus) => {
    return dodStatus.name === status
  });
  if (color === undefined) {
    console.log(status);
    return 'ababab';
  }
  return color.color;
}
