import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../../user/user.schema";

export type RevisionUpdateDocument = RevisionUpdate & Document;

@Schema()
export class RevisionUpdate {

  @Prop({required: false, default: new Date()})
  created_date: Date;

  @Prop({required: true})
  version: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  owner: User;

  @Prop({default: []})
  sections: string[];

}

export const RevisionUpdateSchema = SchemaFactory.createForClass(RevisionUpdate);
