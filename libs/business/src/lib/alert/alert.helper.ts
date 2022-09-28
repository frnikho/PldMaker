import { Injectable } from "@nestjs/common";
import { Model, Query } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Alert } from "./alert.schema";
import { User } from "@pld/shared";

@Injectable()
export class AlertHelper {

  constructor(@InjectModel('Alert') private alert: Model<Alert> ) {
  }

  public static populateAndExecute<T, Z>(query: Query<T, Z>) {
    return query.exec();
  }

  public getAlerts(user: User) {
    return AlertHelper.populateAndExecute(this.alert.find({owner: user}));
  }

  public create(user: User) {

  }

  public delete(user: User) {

  }

  public update(user: User) {

  }

}
