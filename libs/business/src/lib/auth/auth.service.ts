import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ApiErrorsCodes, buildException, defaultPreference, PayloadLogin, RegisterBody, RegisterResponse, User } from "@pld/shared";
import { Timezone } from "@pld/utils";
import { ApiException } from "../exception/api.exception";

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,) {
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersService.findWithPassword({email});
    if (user === null || user === undefined) {
      throw new ApiException(buildException(ApiErrorsCodes.USER_NOT_FOUND));
    } else if (await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new ApiException(buildException(ApiErrorsCodes.INVALID_PASSWORD));
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
      throw new ApiException(buildException(ApiErrorsCodes.USER_ALREADY_EXISTS));
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
        preference: defaultPreference,
        roles: [],
        domain: [],
        profile_picture: 'default_profile_picture.png',
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
