import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserController} from "./user.controller";
import { UserDefinition } from "./user.schema";
import {UserService} from "./user.service";
import { FavourDefinition } from "./favour.schema";
import { UserHelper } from "./user.helper";
import { CalendarService } from "../organization/calendar/calendar.service";
import { CalendarDefinition } from "../organization/calendar/calendar.model";
import { CalendarEventDefinition } from "../organization/calendar/calendar_event.model";
import { CalendarHelper } from "../organization/calendar/calendar.helper";

@Module({
  imports: [
    MongooseModule.forFeature([UserDefinition, FavourDefinition, CalendarDefinition, CalendarEventDefinition]),
  ],
  providers: [UserHelper, UserService, CalendarService, CalendarHelper],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
