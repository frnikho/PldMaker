import { BadRequestException, Injectable } from "@nestjs/common";
import { MfaOtpBody, MfaType, User } from "@pld/shared";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { Mfa } from "./mfa.schema";
import { authenticator, totp } from 'otplib';
import * as base32 from 'base32';
import { UserService } from "../../user/user.service";


@Injectable()
export class MfaHelper {
  constructor(@InjectModel('Mfa') private mfaModel: Model<Mfa>, private userService: UserService) {}

  public static populateAndExecute(query: Query<any, any>) {
    return query.populate('user').exec();
  }

  public async enableOtp(user: User) {
    authenticator.options = {
      step: 30,
      window: 1,
    }
    const secret = authenticator.generateSecret();
    const mfaModel = await MfaHelper.populateAndExecute(this.mfaModel.findOne({user: user._id, type: MfaType.OTP}).select('+secret'));
    if (!mfaModel) {
      console.log('created !');
      return await this.mfaModel.create({
        validate: false,
        user: user._id,
        secret: secret,
        activationDate: new Date(),
        createdDate: new Date(),
        type: MfaType.OTP,
      });
    } else {
      return mfaModel;
    }
  }

  public async validateOtpCode(user: User, body: MfaOtpBody) {
    const mfa = await this.mfaModel.findOne({user: user._id, type: MfaType.OTP}).select('+secret').exec();
    if (!mfa)
      throw new BadRequestException('You need to enable MFA before validating token !');
    if (!authenticator.check(body.token, mfa.secret))
      throw new BadRequestException('Invalid OTP token !');
    return MfaHelper.populateAndExecute(this.mfaModel.findOneAndUpdate({user: user}, {validate: 1, backupCode: base32.encode(user._id + process.env.MFA_SECRET)}, {new: true}).select('+backupCode'));
  }

  public disableMfa(user: User, mfaId: string) {
    return MfaHelper.populateAndExecute(this.mfaModel.findOneAndDelete({_id: mfaId, user: user}));
  }

  public getMfa(user: User) {
    return MfaHelper.populateAndExecute(this.mfaModel.find({user: user}));
  }

}
