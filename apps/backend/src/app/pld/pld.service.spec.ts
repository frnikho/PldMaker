import { Test, TestingModule } from '@nestjs/testing';
import { PldService } from './pld.service';
import {rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {Pld, PldDocument, PldSchema} from "./pld.schema";
import {UserService} from "../user/user.service";
import {OrganizationService} from "../organization/organization.service";
import {User, UserDocument, UserSchema} from "../user/user.schema";
import {Organization, OrganizationDocument, OrganizationSchema} from "../organization/organization.schema";
import {UserMock} from "../factory/user.mock";
import {OrganizationMock} from "../factory/organization.mock";
import {PldMock} from "../factory/pld.mock";

describe('PldService', () => {
  let service: PldService;
  let userService: UserService;
  let orgService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([
        {name: Pld.name, schema: PldSchema},
        {name: User.name, schema: UserSchema},
        {name: Organization.name, schema: OrganizationSchema}])],
      providers: [PldService, OrganizationService, UserService],
    }).compile();

    service = module.get<PldService>(PldService);
    userService = module.get<UserService>(UserService);
    orgService = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(orgService).toBeDefined();
  });

  describe('Create an "User" PLD', () => {
    let ownerUser: UserDocument;

    beforeEach(async () => {
      ownerUser = await userService.create(UserMock.createUser({email: 'hello@hello.com'}));
    });

    it('Create a PLD', async () => {
      const createdPld: Pld = await service.create(PldMock.createPldWithUserOwner({owner: ownerUser, description: 'abc', version: 1.0, name: 'Hello World'}));
      expect(createdPld).not.toBeNull();
      expect((createdPld.owner as User)).toBe(ownerUser);
    });

    it('Update a PLD', async () => {
      const createdPld: PldDocument = await service.create(PldMock.createPldWithUserOwner({owner: ownerUser, description: 'abc', version: 1.0, name: 'Hello World'}));
      createdPld.name = 'Test #1';
      const updatedPld: PldDocument = await service.update(createdPld._id, ownerUser._id, createdPld);
      expect(updatedPld.name).toBe('Test #1');
      expect(updatedPld.description).toBe('abc');
    })

    it('Delete a PLD', async () => {
      const createdPld: PldDocument = await service.create(PldMock.createPldWithUserOwner({owner: ownerUser, description: 'abc', version: 1.0, name: 'Hello World'}));
      const deletedPld: PldDocument = await service.delete(createdPld._id, ownerUser._id);
      expect(await service.find(deletedPld._id)).toBe(null);
    });
  });

  describe('Create an "Organization" PLD', () => {
    let org: OrganizationDocument;
    let ownerUser: UserDocument;

    beforeEach(async () => {
      ownerUser = await userService.create(UserMock.createUser({email: 'hello@hello.com'}));
      org = await orgService.create(OrganizationMock.createOrg({owner: ownerUser, name: 'Hello World'}));
    });

    it('Create a PLD', async () => {
      const createdPld: Pld = await service.create(PldMock.createPldWithOrgOwner({owner: org, description: 'abc', version: 1.0, name: 'Hello World'}));
      expect(createdPld).not.toBeNull();
      expect((createdPld.owner as Organization).owner).toBe(ownerUser);
    });
  })
});
