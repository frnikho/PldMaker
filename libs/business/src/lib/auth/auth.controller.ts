import { Body, Controller, Delete, Get, HttpCode, Param, Post, Request, UseGuards } from "@nestjs/common";
import {LocalAuthGuard} from "./guard/local-auth.guard";
import {AuthService} from "./auth.service";
import { BypassMfa, Public } from "./jwt/public.decorator";
import { DeviceBody, MfaOtpBody, RegisterBody } from "@pld/shared";
import {UserService} from "../user/user.service";
import { MfaService } from "./mfa/mfa.service";

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private userService: UserService, private mfaService: MfaService) {}

  @Public()
  @BypassMfa()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  public async login(@Request() req) {
    const loggedUser = this.authService.login(req.user);
    await this.userService.addDevices(req.user, req.clientIp, req.body as DeviceBody);
    return loggedUser;
  }

  @Post('register')
  @Public()
  @BypassMfa()
  @HttpCode(201)
  public register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

  @Get('mfa')
  public getUserMfa(@Request() req) {
    return this.mfaService.getMfa(req.user);
  }

  @Post('mfa/otp/enable')
  public getOtpCode(@Request() req) {
    return this.mfaService.enableOtp(req.user);
  }

  @Post('mfa/otp/validate')
  public validateOtpCode(@Request() req, @Body() body: MfaOtpBody) {
    return this.mfaService.validateOtpCode(req.user, body);
  }

  @BypassMfa()
  @Post('mfa/otp/login')
  public loginOtpCode(@Request() req, @Body() body: MfaOtpBody) {
    return this.mfaService.loginOtp(req.user, body);
  }

  @Delete('mfa/otp/:otpId')
  public deleteOtp(@Request() req, @Param('otpId') otpId: string) {
    return this.mfaService.disableMfa(req.user, otpId);
  }

}
