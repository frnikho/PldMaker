import {Organization} from "../organization/Organization";
import {Pld} from "../pld/Pld";
import {User} from "./User";
import { Calendar } from "../organization/calendar/Calendar";
import { IsEnum } from "class-validator";
import { IsObjectID } from "../validator/ObjectIdValidator";

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

export class AddFavourBody {
  @IsEnum(FavourType)
  type: FavourType;

  @IsObjectID()
  data_id: string;

  constructor(type: FavourType, data_id: string) {
    this.type = type;
    this.data_id = data_id;
  }
}
