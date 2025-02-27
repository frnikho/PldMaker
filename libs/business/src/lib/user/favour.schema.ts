import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import {Pld} from "../pld/pld.schema";
import {Organization} from "../organization/organization.schema";
import {User} from "./user.schema";
import { Calendar } from "../organization/calendar/calendar.model";

@Schema()
export class Favour {

  @Prop({required: false, default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pld'}]})
  pld: Pld[];

  @Prop({required: false, default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}]})
  org: Organization[];

  @Prop({required: false, default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Calendar'}]})
  calendars: Calendar[];

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  owner: User;
}

export const FavourSchema = SchemaFactory.createForClass(Favour);

export const FavourDefinition: ModelDefinition = {
  name: Favour.name,
  schema: FavourSchema,
}
