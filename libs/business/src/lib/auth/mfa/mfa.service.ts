import { Injectable } from "@nestjs/common";
import { MfaOtpBody, User } from "@pld/shared";
import { MfaHelper } from "./mfa.helper";

@Injectable()
export class MfaService {

  constructor(private mfaHelper: MfaHelper) {}

  public enableOtp(user: User) {
    return this.mfaHelper.enableOtp(user);
  }

  public validateOtpCode(user: User, body: MfaOtpBody) {
    return this.mfaHelper.validateOtpCode(user, body);
  }

  public disableMfa(user: User, otpId: string) {
    return this.mfaHelper.disableMfa(user, otpId);
  }

  public getMfa(user: User) {
    return this.mfaHelper.getMfa(user);
  }

  public loginOtp(user: User, body: MfaOtpBody) {
    return this.mfaHelper.loginOtp(user, body);
  }

  public async checkMfaAuth(user: User, bearerToken: string): Promise<boolean> {
    return this.mfaHelper.checkMfaAuth(user, bearerToken);
  }

}
