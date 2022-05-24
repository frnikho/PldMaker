import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {closeInMongoConnection, rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.schema";

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll( async () => {
    await closeInMongoConnection();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create user service function', () => {
    it('Create normal user', async () => {
      const userCreated: User = await service.create({
        created_date: new Date(),
        email: 'Hello World',
        password: '358227',
        roles: ['user'],
        updated_date: new Date(),
      });
      expect(userCreated).not.toBeNull();
    });

    it('Create a null user', async () => {
      try {
        await service.create(null);
      } catch (ex) {
        expect(ex).not.toBeNull();
      }
    });

  });

});
