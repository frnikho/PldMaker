import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { ApiException } from "../../exception/api.exception";
import { ApiErrorsCodes, buildException } from "@pld/shared";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private authService: AuthService) {
    super({usernameField: 'email', passwordField: 'password'});
  }

  public async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user)
      throw new ApiException(buildException(ApiErrorsCodes.UNAUTHORIZED));
    user._id = user._id.toString();
    return user;
  }

}
