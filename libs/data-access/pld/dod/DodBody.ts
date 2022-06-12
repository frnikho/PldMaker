export type DodCreateBody = {
  version: string;
  title: string;
  skinOf: string;
  want: string;
  description: string;
  pldOwner: string;
  owner: string;
  descriptionOfDone: string[];
  estimatedWorkTime: UserWorkTime[];
}

type UserWorkTime = {
  users: string[];
  value: number;
  format: string,
}

export enum WorkTimeFormat {
  JOUR_HOMME = 'J/H',
  HOURS = 'Heures',
}
