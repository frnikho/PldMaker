import {Organization} from "../organization/Organization";
import {Pld} from "../pld/Pld";
import {User} from "./User";
import { Calendar } from "../organization/calendar/Calendar";

export type Favour = {
  _id: string;
  pld: Pld[];
  org: Organization[];
  calendars: Calendar[];
  owner: User;
}

export enum FavourType {
  PLD = 'Pld',
  ORG = 'Organization',
  CALENDAR = 'Calendar'
}

export type AddFavourBody = {
  type: FavourType;
  data_id: string;
}
