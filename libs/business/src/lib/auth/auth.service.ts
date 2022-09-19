import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PayloadLogin, RegisterBody, RegisterResponse, User } from "@pld/shared";
import { Timezone } from "@pld/utils";

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,) {
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.findWithPassword({email});
    if (user === null || user === undefined) {
      throw new UnauthorizedException('User not found');
    } else if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid password');
  }

  public login(user: User) {
    const payload: PayloadLogin = {email: user.email, sub: user._id.valueOf(), mfa: []};
    return {
      access_token: this.jwtService.sign(JSON.stringify(payload))
    }
  }

  public async register(body: RegisterBody): Promise<RegisterResponse> {
    const user = await this.usersService.findByEmail(body.email);
    if (user !== null && user.email === body.email) {
      throw new BadRequestException('User already exists !');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const createdUser = await this.usersService.create({
      email: body.email,
      firstname: body.firstname,
      timezone: Timezone["Europe/Paris"],
      lastname: body.lastname,
      password: hashedPassword,
      roles: ['user'],
      updated_date: new Date(),
      created_date: new Date(),
      devices: [],
    });
    return {
      accessToken: this.login(createdUser).access_token,
      user: {
        roles: [],
        email: createdUser.email,
        lastname: createdUser.lastname,
        firstname: createdUser.firstname,
        timezone: Timezone["Europe/Paris"],
        created_date: createdUser.created_date,
        updated_date: createdUser.updated_date,
        _id: createdUser._id,
        devices: [],
      }
    };
  }
}
