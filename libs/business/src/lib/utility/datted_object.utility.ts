import {Prop} from "@nestjs/mongoose";

export class DatedObjectSchema {

  @Prop({default: new Date()})
  created_date?: Date;

  @Prop({default: new Date()})
  updated_date?: Date;

}
