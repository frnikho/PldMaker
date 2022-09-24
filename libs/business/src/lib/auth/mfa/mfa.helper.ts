import { BadRequestException, Injectable } from "@nestjs/common";
import { Mfa, MfaDisableType, MfaOtpBody, MfaOtpDisableBody, MfaType, PayloadLogin, User } from "@pld/shared";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { authenticator } from "otplib";
import * as base32 from "base32";
import { UserService } from "../../user/user.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class MfaHelper {
  constructor(@InjectModel('Mfa') private mfaModel: Model<Mfa>, private userService: UserService, private jwtService: JwtService) {}

  public static populateAndExecute<T, Z>(query: Query<T, Z>) {
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
        verified: false,
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
      throw new BadRequestException('Invalid OTP Token !');
    await this.mfaModel.findOneAndUpdate({user: user}, {verified: 1, activationDate: new Date(), backupCode: base32.encode(user._id + process.env.MFA_SECRET)}, {new: true}).select('+backupCode');
    return this.jwtService.sign({email: user.email, sub: user._id, mfa: [{secret: mfa.secret, date: new Date()}]} as PayloadLogin);
  }

  public async disableMfa(user: User, mfa: Mfa, body: MfaOtpDisableBody) {
    if (body.type === MfaDisableType.BACKUP_CODE) {
      return MfaHelper.populateAndExecute(this.mfaModel.findOneAndDelete({_id: mfa._id, user: user, backupCode: body.code}));
    } else {
      console.log(authenticator.check(body.code, mfa.secret), body.code);
      if (!authenticator.check(body.code, mfa.secret)) {
        throw new BadRequestException('Invalid OTP Token !');
      }
      console.log(await this.mfaModel.findOne({_id: mfa._id.toString(), user: user}));
      return MfaHelper.populateAndExecute(this.mfaModel.findOneAndDelete({_id: mfa._id.toString(), user: user}));
    }
  }

  public getMfa(user: User, select = '') {
    return MfaHelper.populateAndExecute(this.mfaModel.find({user: user}).select(select));
  }

  public async loginOtp(user: User, body: MfaOtpBody) {
    const mfa = await this.mfaModel.findOne({user: user._id, type: MfaType.OTP}).select('+secret').exec();
    if (!mfa)
      throw new BadRequestException('You need to enable MFA before validating token !');
    if (!authenticator.check(body.token, mfa.secret))
      throw new BadRequestException('Invalid OTP token !');
    return this.jwtService.sign({email: user.email, sub: user._id, mfa: [{secret: mfa.secret, date: new Date()}]} as PayloadLogin);
  }

  public async checkMfaAuth(user: User, bearerToken: string): Promise<boolean> {
    const mfa: Mfa[] = await this.getMfa(user, '+secret');
    const payload: PayloadLogin = this.jwtService.verify(bearerToken);
    const otp = mfa.find((m) => m.type === MfaType.OTP && m.verified === true);
    if (otp === undefined)
      return true;
    return payload.mfa.some((value) => value.secret === otp.secret);
  }

}
