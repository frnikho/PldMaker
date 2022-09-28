import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AlertAction, AlertTarget, User } from "@pld/shared";
import { Deadline } from "@pld/utils";
import { alertRules } from "./alert.rule";

@Schema({versionKey: false})
export class Alert {

  @Prop(alertRules.title)
  title: string;

  @Prop(alertRules.content)
  content: string;

  @Prop(alertRules.key)
  key: string;

  @Prop(alertRules.enable)
  enable: boolean;

  @Prop(alertRules.owner)
  owner: User;

  @Prop(alertRules.position)
  position: string;

  @Prop(alertRules.action)
  action: AlertAction[];

  @Prop(alertRules.deadline)
  deadline?: Deadline;

  @Prop(alertRules.createdDate)
  createdDate: Date;

  @Prop(alertRules.updatedDate)
  updatedDate: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

export const AlertDefinition: ModelDefinition = {
  name: Alert.name,
  schema: AlertSchema,
}
