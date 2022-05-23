import {Prop} from "@nestjs/mongoose";

export class DattedObjectSchema {

  @Prop()
  created_date: Date;

  @Prop()
  updated_date: Date;

}
