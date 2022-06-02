import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import {rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {Organization, OrganizationSchema} from "./organization.schema";
import {OrganizationModule} from "./organization.module";

describe('OrganizationController', () => {
  let controller: OrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrganizationModule, rootMongooseTestModule(), MongooseModule.forFeature([{name: Organization.name, schema: OrganizationSchema}])],
      controllers: [OrganizationController],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
