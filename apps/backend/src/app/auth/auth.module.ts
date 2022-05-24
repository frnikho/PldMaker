import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategy/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {ConfigFilesModule} from "../config/configfiles.module";

@Module({
  imports: [UserModule, PassportModule, ConfigFilesModule, JwtModule.registerAsync({
    useFactory: () => {
      return ({
        secret: process.env.JWT_SECRET,
      })
    }
  })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
