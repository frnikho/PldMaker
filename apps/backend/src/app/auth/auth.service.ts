import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {UserDocument} from "../user/user.schema";
import {RegisterUserBody} from "../../../../../libs/data-access/auth/RegisterUserBody";
import {ConfigFilesService} from "../config/configfiles.service";
@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private config: ConfigFilesService) {
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.findWithPassword({email});
    if (user === null || user === undefined) {
      throw new UnauthorizedException(this.config.getLanguage().auth.userNotFound);
    } else if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid password');
  }

  public login(user: UserDocument) {
    const payload = {email: user.email, sub: user._id.valueOf()};
    return {
      access_token: this.jwtService.sign(JSON.stringify(payload))
    }
  }

  public async register(body: RegisterUserBody) {
    const user = await this.usersService.findByEmail(body.email);
    if (user !== null && user.email === body.email) {
      throw new BadRequestException(this.config.getLanguage().auth.userAlreadyRegistered);
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return this.usersService.create({
      email: body.email,
      password: hashedPassword,
      roles: ['user'],
      updated_date: new Date(),
      created_date: new Date()
    });
  }
}
