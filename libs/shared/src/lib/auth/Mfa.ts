import { User } from "../user/User";
import { Length } from "class-validator";

export enum MfaType {
  OTP = 'OTP',
}

export class Mfa {
  type: MfaType;
  user: User;
  backupCode: string;
  secret: string;
  createdDate: Date;
  activationDate: Date;
  validate: boolean;

  constructor(type: MfaType, user: User, backupCode: string, secret: string, createdDate: Date, activationDate: Date, validate: boolean) {
    this.type = type;
    this.user = user;
    this.backupCode = backupCode;
    this.secret = secret;
    this.createdDate = createdDate;
    this.activationDate = activationDate;
    this.validate = validate;
  }
}

export class MfaOtpBody {
  @Length(6, 6)
  token: string;

  secret: string;

  constructor(token: string, secret: string) {
    this.token = token;
    this.secret = secret;
  }
}
