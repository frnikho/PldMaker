import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AlertDefinition } from "./alert.schema";
import { AlertHelper } from "./alert.helper";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";

@Module({
  imports: [MongooseModule.forFeature([AlertDefinition])],
  providers: [AlertHelper, AlertService],
  controllers: [AlertController],
  exports: [AlertHelper, AlertService],
})
export class AlertModule {}
