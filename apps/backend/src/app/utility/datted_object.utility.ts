import {Prop} from "@nestjs/mongoose";

export class DattedObject {

  @Prop()
  created_date: Date;

  @Prop()
  updated_date: Date;

}
