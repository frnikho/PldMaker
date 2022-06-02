import {DatedObjectSchema} from "../../utility/datted_object.utility";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {EstimatedWorkTime} from "./estimated_work_time/estimated_work_time.schema";

export type DodDocument = Dod & Document;

@Schema()
export class Dod extends DatedObjectSchema {

  @Prop()
  version: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  descriptionOfDone: string[];

  estimatedWorkTime: EstimatedWorkTime[];

}

export const DodSchema = SchemaFactory.createForClass(Dod);
