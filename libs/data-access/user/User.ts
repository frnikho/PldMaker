import {DatedObject} from "../DatedObject";

export type User = {
  _id: string;
  email: string;
  password?: string;
  firstname?: string;
  lastname?: string;
} & DatedObject
