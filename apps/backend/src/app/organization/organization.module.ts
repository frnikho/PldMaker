import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Organization, OrganizationSchema} from "./organization.schema";
import {UserModule} from "../user/user.module";

@Module({
  imports: [MongooseModule.forFeature([{name: Organization.name, schema: OrganizationSchema}]), UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
