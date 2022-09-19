import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { BYPASS_MFA_KEY } from "../jwt/public.decorator";
import { Reflector } from "@nestjs/core";
import { MfaService } from "./mfa.service";
import { Mfa, MfaType } from "@pld/shared";

@Injectable()
export class MfaGuard implements CanActivate {

  constructor(private reflector: Reflector, private mfaService: MfaService) {
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization'];
    const bypassMfa = this.reflector.getAllAndOverride<boolean>(BYPASS_MFA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (bypassMfa)
      return true;
    if (!token)
      throw new ForbiddenException('a token must be provided !');
    if (!await this.mfaService.checkMfaAuth(req.user, token.split('Bearer ')[1]))
      throw new ForbiddenException('MFA_OTP_REQUIRED');
    return true;
  }

}
