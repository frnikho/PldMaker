import {Body, Controller, HttpCode, Post, Request, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "./guard/local-auth.guard";
import {AuthService} from "./auth.service";
import {Public} from "./public.decorator";
import {DeviceBody, RegisterBody} from "@pld/shared";
import {UserService} from "../user/user.service";

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private userService: UserService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  public async login(@Request() req) {
    const loggedUser = this.authService.login(req.user);
    console.log(await this.userService.addDevices(req.user._id.valueOf(), req.clientIp, req.body as DeviceBody));
    return loggedUser;
  }

  @Post('register')
  @Public()
  @HttpCode(201)
  public async register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

}
