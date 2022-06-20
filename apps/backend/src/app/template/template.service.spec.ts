import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import {rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/user.schema";
import {Template, TemplateSchema} from "./template.schema";

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{name: Template.name, schema: TemplateSchema}]), MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create a default template', () => null)

});
