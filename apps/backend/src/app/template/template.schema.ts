import {DatedObjectSchema} from "../utility/datted_object.utility";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {TemplateType} from "../../../../../libs/data-access/template/TemplateType";

export type TemplateDocument = Template & Document;

@Schema()
export class Template extends DatedObjectSchema {

  @Prop()
  templateType: TemplateType;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);
