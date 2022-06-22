import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserController} from "./user.controller";
import { User, UserSchema } from './user.schema';
import {UserService} from "./user.service";
import {Favour, FavourSchema} from "./favour.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Favour.name, schema: FavourSchema}])
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
