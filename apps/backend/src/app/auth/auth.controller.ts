import {Body, Controller, HttpCode, Post, Request, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "./guard/local-auth.guard";
import {AuthService} from "./auth.service";
import {Public} from "./public.decorator";
import {RegisterUserBody} from "../../../../../libs/data-access/auth/RegisterUserBody";

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  public async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  @HttpCode(201)
  public async register(@Body() body: RegisterUserBody) {
    return this.authService.register(body);
  }

}
