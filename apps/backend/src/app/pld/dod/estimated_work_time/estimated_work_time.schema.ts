import {User} from "../../../user/user.schema";
import {Prop} from "@nestjs/mongoose";
import {
  EstimatedWorkTimeFormat
} from "../../../../../../../libs/data-access/pld/dod/estimated_work_time/EstimatedWorkTimeFormat";
import mongoose from "mongoose";

export class EstimatedWorkTime {

  @Prop({required: true})
  time: string;

  // J/H ou en literal, ex: 52J/H ou 1 mois et 2 jour
  @Prop({required: false, default: EstimatedWorkTimeFormat.JOUR_HOMME, enum: EstimatedWorkTimeFormat})
  format: EstimatedWorkTimeFormat;

  @Prop({required: true, type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
  author: User[];
}
