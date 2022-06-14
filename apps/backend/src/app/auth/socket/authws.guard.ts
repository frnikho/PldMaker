import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {WsPayload} from "../../../../../../libs/data-access/auth/WsPayload";
import {WsException} from "@nestjs/websockets";
import {JwtService} from "@nestjs/jwt";
import {PayloadLogin} from "../../../../../../libs/data-access/auth/PayloadLogin";
import {UserService} from "../../user/user.service";

@Injectable()
export class AuthWsGuard implements CanActivate {

  constructor(private jwtService: JwtService, private userService: UserService) {

  }

  async canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData();
    if (data[0] === undefined)
      throw new WsException('You must be connected !');
    const payload: WsPayload = data[0];
    if (payload === undefined || payload.accessToken === undefined || payload.accessToken.length <= 0)
      throw new UnauthorizedException('Invalid payload !');
    const decodedPayload: PayloadLogin = this.jwtService.decode(payload.accessToken) as PayloadLogin;
    const user = await this.userService.find(decodedPayload.sub);
    if (user === null)
      throw new UnauthorizedException('Invalid payload !');
    context.switchToWs().getData()[0] = user;
    return true;
  }
}
