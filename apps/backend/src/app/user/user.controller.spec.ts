import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.schema";
import {UserService} from "./user.service";

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Test find user functions', () => {
    it('find a non existing user', async () => {
      const user = await controller.findUserByEmail('nicolas.');
      console.log(user);
    });
  })

});
