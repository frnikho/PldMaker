import { Module } from '@nestjs/common';
import {Gateway} from "./gateway.socket";
import {JwtModule} from "@nestjs/jwt";
import {GatewayService} from "./gateway.service";
import { OrganizationModule } from "../organization/organization.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, OrganizationModule, JwtModule.registerAsync({
    useFactory: () => {
      return ({
        secret: process.env.JWT_SECRET,
      })
    }
  })],
  providers: [Gateway, GatewayService],
  exports: [Gateway, GatewayService]
})
export class GatewayModule {}
