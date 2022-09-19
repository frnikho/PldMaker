import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MfaType, User } from "@pld/shared";
import mongoose from "mongoose";

@Schema()
export class Mfa {
  @Prop({enum: MfaType})
  type: string;

  @Prop({required: false})
  verified: boolean;

  @Prop({required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId})
  user: User;

  @Prop({required: false, select: false})
  backupCode: string;

  @Prop({required: false, select: false})
  secret: string;

  @Prop({required: false, default: new Date()})
  createdDate: Date;

  @Prop({required: false, default: new Date()})
  activationDate: Date;
}

export const MfaSchema = SchemaFactory.createForClass(Mfa);

export const MfaDefinition: ModelDefinition = {
  name: Mfa.name,
  schema: MfaSchema
}
