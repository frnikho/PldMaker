import { User } from "../user/User";
import { Length } from "class-validator";

export enum MfaType {
  OTP = 'OTP',
}

export class Mfa {
  _id: string;
  type: MfaType;
  user: User;
  backupCode: string;
  secret: string;
  createdDate: Date;
  activationDate: Date;
  verified: boolean;

  constructor(_id: string, type: MfaType, user: User, backupCode: string, secret: string, createdDate: Date, activationDate: Date, verified: boolean) {
    this._id = _id;
    this.type = type;
    this.user = user;
    this.backupCode = backupCode;
    this.secret = secret;
    this.createdDate = createdDate;
    this.activationDate = activationDate;
    this.verified = verified;
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

export enum MfaDisableType {
  BACKUP_CODE = 'Backup_Code',
  AUTH_CODE = 'Auth_Code',
}

export class MfaOtpDisableBody {
  code: string;
  type: MfaDisableType;

  constructor(code: string, type: MfaDisableType) {
    this.code = code;
    this.type = type;
  }
}
