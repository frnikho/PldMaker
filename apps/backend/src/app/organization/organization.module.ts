import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Organization, OrganizationSchema} from "./organization.schema";
import {UserModule} from "../user/user.module";
import {OrganizationListener} from "./organization.listener";

@Module({
  imports: [MongooseModule.forFeature([{name: Organization.name, schema: OrganizationSchema}]), UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationListener],
  exports: [OrganizationService]
})
export class OrganizationModule {}
