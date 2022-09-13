import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategy/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy/jwt.strategy";
import { MfaService } from "./mfa/mfa.service";
import { MfaHelper } from "./mfa/mfa.helper";
import { MongooseModule } from "@nestjs/mongoose";
import { MfaDefinition } from "./mfa/mfa.schema";

@Module({
  imports: [MongooseModule.forFeature([MfaDefinition]),
    UserModule, PassportModule, JwtModule.registerAsync({
    useFactory: () => {
      return ({
        secret: process.env.JWT_SECRET,
      })
    }
  })],
  controllers: [AuthController],
  providers: [MfaService, MfaHelper, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
