import {Body, Controller, HttpCode, Post, Request, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "./guard/local-auth.guard";
import {AuthService} from "./auth.service";
import {Public} from "./public.decorator";
import {RegisterBody} from "@pld/shared";

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
  public async register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

}
