import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../../user/user.schema";
import {Organization} from "../../organization/organization.schema";
import {PldOwnerType} from "../../../../../../libs/data-access/pld/PldOwnerType";

export type RevisionUpdateDocument = RevisionUpdate & Document;

@Schema()
export class RevisionUpdate {

  @Prop({required: false, default: new Date()})
  created_date: Date;

  @Prop({required: true})
  version: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, refPath: 'ownerType'})
  owner: User | Organization;

  @Prop({type: String, required: true, enum: PldOwnerType})
  ownerType: PldOwnerType;

  @Prop({default: []})
  sections: string[];

}

export const RevisionUpdateSchema = SchemaFactory.createForClass(RevisionUpdate);
