import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import {MongooseModule} from "@nestjs/mongoose";
import { TemplateDefinition } from "./template.schema";
import { TemplateHelper } from "./template.helper";
import { OrganizationDefinition } from "../organization/organization.schema";

@Module({
  imports: [MongooseModule.forFeature([TemplateDefinition, OrganizationDefinition])],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateHelper],
  exports: [TemplateService],
})
export class TemplateModule {}
