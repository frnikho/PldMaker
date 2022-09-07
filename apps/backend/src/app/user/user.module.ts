import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserController} from "./user.controller";
import { UserDefinition } from "./user.schema";
import {UserService} from "./user.service";
import { FavourDefinition } from "./favour.schema";
import { UserHelper } from "./user.helper";

@Module({
  imports: [
    MongooseModule.forFeature([UserDefinition, FavourDefinition]),
  ],
  providers: [UserHelper, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
