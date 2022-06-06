import {DatedObject} from "../../DatedObject";

export type Dod = {

  id: string;

  version: number;

  title: string;

  skinOf: string;

  want: string;

  description: string;

  descriptionOfDone: string[];

  estimatedWorkTime: unknown[];

} & DatedObject;
