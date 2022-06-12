import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {DatedObjectSchema} from "../utility/datted_object.utility";
import {User} from "../user/user.schema";
import {Organization} from "../organization/organization.schema";
import {PldOwnerType} from "../../../../../libs/data-access/pld/PldOwnerType";
import {PldStatus} from "../../../../../libs/data-access/pld/PldStatus";

export type PldDocument = Pld & Document;

@Schema()
export class RevisionUpdate {
  @Prop({required: false, default: new Date()})
  created_date: Date;

  @Prop({required: true})
  version: string;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name})
  owner: mongoose.Schema.Types.ObjectId | User;

  @Prop({required: false, default: ['Toutes']})
  sections: string[];

  @Prop({required: false, default: ''})
  comments: string;
}

@Schema()
export class Pld extends DatedObjectSchema {

  /**
   * 'Titre"
   */
  @Prop({required: true})
  title: string;

  /**
   * 'Object'
   */
  @Prop({required: false, default: ''})
  description: string;

  /**
   * 'Auteur'
   */
  @Prop({type: mongoose.Schema.Types.ObjectId, refPath: 'ownerType'})
  owner: User | Organization;

  @Prop({type: String, required: true, enum: PldOwnerType})
  ownerType: PldOwnerType;

  /**
   * 'Responsable'
   * joue également sur le champ email
   */

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  manager: User;

  /**
   * 'Mots-clés'
   */

  @Prop({required: false, default: []})
  tags?: string[];

  /**
   * 'Promotion'
   */
  @Prop({default: new Date().getFullYear() + 2})
  promotion: number;

  /**
   * 'Version du modèle'
   */
  @Prop({required: false, default: 1.0})
  version: number;

  /**
   * 'Status'
   */
  @Prop({required: false, enum: PldStatus, default: PldStatus.edition})
  status: string;

  /**
   * 'Tableau des révisions'
   */
  @Prop({required: false, default: []})
  revisions: RevisionUpdate[];

}

export const PldSchema = SchemaFactory.createForClass(Pld);
