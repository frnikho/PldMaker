import { Module } from '@nestjs/common';
import {Gateway} from "./gateway.socket";
import {JwtModule} from "@nestjs/jwt";
import {UserModule} from "../user/user.module";

@Module({
  imports: [UserModule, JwtModule.registerAsync({
    useFactory: () => {
      return ({
        secret: process.env.JWT_SECRET,
      })
    }
  })],
  providers: [Gateway],
  exports: [Gateway]
})
export class GatewayModule {}
