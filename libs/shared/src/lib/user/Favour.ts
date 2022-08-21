import {Organization} from "../organization/Organization";
import {Pld} from "../pld/Pld";
import {User} from "./User";

export type Favour = {
  _id: string;
  pld: Pld[];
  org: Organization[];
  owner: User;
}

export enum FavourType {
  PLD = 'Pld',
  Organization = 'Organization',
}

export type AddFavourBody = {
  type: FavourType;
  data_id: string;
}

export type RemoveFavourBody = {
  favourId: string;
}
