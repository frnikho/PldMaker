import { Injectable } from "@nestjs/common";
import { Model, Query } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Alert } from "./alert.schema";

@Injectable()
export class AlertHelper {

  constructor(@InjectModel('Alert') private alert: Model<Alert> ) {
  }

  public static populateAndExecute(query: Query<any, any>) {

  }

}
