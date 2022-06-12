import { Test, TestingModule } from '@nestjs/testing';
import { PldService } from './pld.service';
import {rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {Pld, PldDocument, PldSchema, RevisionUpdate} from "./pld.schema";
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
      const createdPld: Pld = await service.create(PldMock.createPldWithUserOwner({owner: ownerUser, description: 'abc', version: 1.0, title: 'Hello World'}));
      expect(createdPld).not.toBeNull();
      expect((createdPld.owner as User)).toBe(ownerUser);
    });

    it('Update a PLD', async () => {
      const createdPld: PldDocument = await service.create(PldMock.createPldWithUserOwner({owner: ownerUser, description: 'abc', version: 1.0, title: 'Hello World'}));
      createdPld.title = 'Test #1';
      const updatedPld: PldDocument = await service.update(createdPld._id, ownerUser._id, createdPld);
      expect(updatedPld.title).toBe('Test #1');
      expect(updatedPld.description).toBe('abc');
    })

    it('Delete a PLD', async () => {
      const createdPld: PldDocument = await service.create(PldMock.createPldWithUserOwner({owner: ownerUser, description: 'abc', version: 1.0, title: 'Hello World'}));
      const deletedPld: PldDocument = await service.delete(createdPld._id, ownerUser._id);
      expect(await service.find(deletedPld._id)).toBe(null);
    });
  });

  describe('Create an "Organization" PLD', () => {
    let org: OrganizationDocument;
    let ownerUser: UserDocument;
    let managerUser: UserDocument;

    beforeEach(async () => {
      ownerUser = await userService.create(UserMock.createUser({email: 'hello@hello.com'}));
      managerUser = await userService.create(UserMock.createUser({email: 'manager@hello.com'}));
      org = await orgService.create(OrganizationMock.createOrg({owner: ownerUser, name: 'Hello World'}));
    });

    it('Create a PLD', async () => {
      const revisionUpdate: RevisionUpdate[] = [
        {
          owner: ownerUser,
          version: '1.0',
          created_date: new Date(),
          sections: ['Toutes'],
          comments: ''
        }
      ];
      const createdPld: PldDocument = await service.create(PldMock.createPldWithOrgOwner({owner: org, revisions: revisionUpdate, manager: managerUser, description: 'abc', version: 1.0, title: 'Hello World'}));
      expect(createdPld).not.toBeNull();
      expect((createdPld.owner as Organization).owner).toBe(ownerUser);
    });
  });

  describe('Create a PLD with Outside context', () => {

    let org: OrganizationDocument;
    const users = {
      justin: undefined,
      victor: undefined,
      baptiste: undefined,
      theo: undefined,
      corentin: undefined,
      clement: undefined,
      van: undefined,
    }

    beforeAll(async () => {
      users.victor = await userService.create(UserMock.createUser({email: 'victor.sauvaget@epitech.eu'}));
      users.justin = await userService.create(UserMock.createUser({email: 'justin.menard@epitech.eu'}));
      users.baptiste = await userService.create(UserMock.createUser({email: 'baptiste.renouf@epitech.eu'}));
      users.theo = await userService.create(UserMock.createUser({email: 'theo.fargeas@epitech.eu'}));
      users.corentin = await userService.create(UserMock.createUser({email: 'corentin.bourdeaux@epitech.eu'}));
      users.clement = await userService.create(UserMock.createUser({email: 'clement.boulay@epitech.eu'}));
      users.van = await userService.create(UserMock.createUser({email: 'van.jspquoi@epitech.eu'}));
      org = await orgService.create(OrganizationMock.createOrg({owner: users.victor, name: 'Outside', members: [users.van, users.clement, users.theo, users.justin, users.baptiste, users.corentin]}));
    })

    it('test org not null', () => {
      expect(org).not.toBeNull();
    })
  })

  describe('adding revision to pld', () => {

    let user: UserDocument;
    let org: OrganizationDocument;
    let pld: PldDocument;

    beforeEach(async () => {
      user = await userService.create(UserMock.createUser({}));
      org = await orgService.create(OrganizationMock.createOrg({owner: user, name: 'abc'}));
      pld = await service.create(PldMock.createPldWithOrgOwner({owner: org, manager: user}));
    })

    it('Adding revisions to a existing pld', async () => {
      await service.addRevision(pld._id, {
        owner: user._id,
        version: '1.0.1',
        created_date: new Date(),
        sections: [''],
      });
      const newPld = await service.addRevision(pld._id, {
        owner: user._id,
        version: '1.0.2',
        created_date: new Date(),
        sections: [''],
      });
      expect(newPld.revisions.length).toBe(2)
    })

    it('Adding revisions to a non existing pld', async () => {
      const newPld: Pld = await service.addRevision(pld._id, {
        owner: user._id,
        version: '1.0.1',
        created_date: new Date(),
        sections: [''],
      });
      expect(newPld).not.toBeNull();
    })

  });
});
