import { Test, TestingModule } from '@nestjs/testing';
import {MemberUpdateObjects, OrganizationService} from './organization.service';
import {Organization, OrganizationDocument, OrganizationSchema} from "./organization.schema";
import {OrganizationMock} from "../factory/organization.mock";
import {rootMongooseTestModule} from "../utility/mongoose_memory.testmodule";
import {MongooseModule} from "@nestjs/mongoose";
import {UserMock} from "../factory/user.mock";
import {User, UserDocument, UserSchema} from "../user/user.schema";
import {UserService} from "../user/user.service";
import {CreateOrganizationBody} from "@pld/shared";

describe('OrganizationService', () => {
  let service: OrganizationService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{name: Organization.name, schema: OrganizationSchema}]), MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
      providers: [OrganizationService, UserService],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create an organization service function', () => {

    it('Create a correct organization with owner populate', async () => {
      let owner: User = UserMock.createUser({email: 'test.test@google.com'});
      owner = await userService.create(owner);
      const org: Organization = OrganizationMock.createOrg({name: 'Outside', description: 'Outside Epitech EIP', owner});
      const createdOrg = await service.create(org);
      const orgFind: OrganizationDocument = await service.find(createdOrg._id);
      expect(orgFind.owner.email).toBe(owner.email);
    });

    it('Create a bad organization with the CreateOrganizationBody', async () => {
      const body: CreateOrganizationBody = {
        name: 'abc',
        versionShifting: 1.0,
        invitedMembers: []
      }
      try {
        await service.createByBody(body, 'abc123');
      } catch (ex) {
        expect(ex).not.toBeNull();
      }
    });

    describe('Manager members of a Organization', () => {
      let ownerUser: UserDocument;
      let org: OrganizationDocument;

      beforeEach(async () => {
        ownerUser = await userService.create(UserMock.createUser({email: 'test.test@google.com'}));
        org = await service.create(OrganizationMock.createOrg({name: 'Outside', description: 'Outside Epitech EIP', owner: ownerUser}));
      })

      it('Add a members', async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        const updatedOrg = await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.some(m => m.email === 'abcd')).toBe(true);
      });

      it('Throw a error when adding a non existing user', async () => {
        try {
          await service.addMembers(org._id, ownerUser._id, ['random']);
          expect(true).toBe(false);
        } catch (ex) {
          expect(ex).not.toBeNull();
        }
      });

      it('Add the same member x times', async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        const updatedOrg = await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(1);
      });

      it('Remove a member', async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        let updatedOrg = await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(1);
        updatedOrg = await service.removeMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(0);
      });

      it('Throw a error when adding a non existing user', async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        const updatedOrg = await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(1);
        try {
          await service.removeMembers(org._id, ownerUser._id, ['abc']);
          expect(true).toBe(false);
        } catch (ex) {
          expect(ex).not.toBeNull();
        }
      });

      it('Remove the same user X time', async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        let updatedOrg = await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(1);
        await service.removeMembers(org._id, ownerUser._id, [newMember._id]);
        await service.removeMembers(org._id, ownerUser._id, [newMember._id]);
        updatedOrg = await service.removeMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(0);
      })

      it(`Should not remove an user if i'm not the organization owner`, async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        let updatedOrg = await service.addMembers(org._id, ownerUser._id, [newMember._id]);
        expect(updatedOrg.members.length).toBe(1);
        updatedOrg = await service.removeMembers(org._id, newMember._id, [newMember._id]);
        expect(updatedOrg).toBe(null);
      })

      it(`Should remove multi user in the same time`, async () => {
        const newMember = await userService.create(UserMock.createUser({email: 'abcd'}));
        const newMember1 = await userService.create(UserMock.createUser({email: 'abcd'}));
        const newMember2 = await userService.create(UserMock.createUser({email: 'abcd'}));
        const newMember3 = await userService.create(UserMock.createUser({email: 'abcd'}));
        const newMember4 = await userService.create(UserMock.createUser({email: 'abcd'}));
        const membersToUpdate: MemberUpdateObjects = ([newMember, newMember1, newMember2, newMember3, newMember4].map((u) => u._id.valueOf()));
        let updatedOrg = await service.addMembers(org._id, ownerUser._id, membersToUpdate);
        expect(updatedOrg.members.length).toBe(5);
        updatedOrg = await service.removeMembers(org._id, ownerUser._id, [newMember._id.valueOf(), newMember2._id.valueOf()]);
        expect(updatedOrg.members.length).toBe(3);
        updatedOrg = await service.removeMembers(org._id, ownerUser._id, [newMember1._id.valueOf(), newMember3._id.valueOf()]);
        expect(updatedOrg.members.length).toBe(1);
      })

    });

  });
});
