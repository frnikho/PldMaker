import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UserService} from "../../user/user.service";
import {User} from "../../user/user.schema";
import {PayloadLogin} from "@pld/shared";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  public async validate(payload: PayloadLogin): Promise<User> {
    const user = await this.userService.find(payload.sub)
    if (user === null || user === undefined)
      throw new UnauthorizedException('Invalid user inside token !');
    return user;
  }
}
