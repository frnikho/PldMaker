import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NewOrgHistory } from "./organization.schema";
import { Model, Query } from "mongoose";
import { UserService } from "../user/user.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InviteUserOrgBody, MigrateOrganizationBody, Organization, RemoveUserOrgBody, UpdateOrganizationBody } from "@pld/shared";
import { CreateOrganizationBody, User } from "@pld/shared";
import { OrgAddMemberEvent, OrgEvents, OrgRemoveMemberEvent } from "./organization.event";
import { UserDocument } from "../user/user.schema";
import { DodStatusHelper } from "../dod/status/dod-status.helper";

@Injectable()
export class OrganizationHelper {

  private readonly logger = new Logger('OrganizationHelper');

  constructor(
    @InjectModel('Organization') private organizationModel: Model<Organization>,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    private dodStatusService: DodStatusHelper) {}


  public static populateAndExecute<T>(query: Query<T, any>) {
    return query.populate(['owner', 'members'])
      .populate({
        path: 'history',
        populate: [{
          path: 'owner',
        }, {
          path: 'member',
        }]
      }).exec();
  }

  public find(orgId: string) {
    return OrganizationHelper.populateAndExecute(this.organizationModel.findOne({_id: orgId}));
  }

  public async createOrg(user: User, org: Organization) {
    this.logger.debug(`Creation of Organization (${user.email} - ${user._id}): `)
    this.logger.debug(org);
    await this.dodStatusService.initializeDodStatus(user, org);
    return this.organizationModel.create({ ...org });
  }

  public async createOrgWithBody(user: User, body: CreateOrganizationBody) {
    this.logger.debug(`Creation of Organization (${user.email} - ${user._id}): `)
    this.logger.debug(body);
    const createdOrg = await this.organizationModel.create({
      name: body.name,
      description: body.description,
      members: [],
      owner: user,
      versionShifting: body.versionShifting,
    });
    await this.dodStatusService.initializeDodStatus(user, createdOrg);
    return createdOrg;
  }

  public deleteOrgWithBody(user: User, org: Organization) {
    this.logger.debug(`Deleting organization (${user.email} - ${user._id}): `)
    this.logger.debug(org);
    return OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndDelete({_id: org._id, owner: user._id}));
  }

  public async updateWithBody(user: User, org: Organization, body: UpdateOrganizationBody) {
    this.logger.debug(`Updating organization (${user.email} - ${user._id}): `)
    this.logger.debug(body);
    const updatedOrg: Organization = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id}, {...body, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    return updatedOrg;
  }

  public getUserOrg(user: User) {
    return OrganizationHelper.populateAndExecute<Organization[]>(this.organizationModel.find({$or: [{owner: user._id}, {members: {$in: user._id}}]}));
  }

  public async addMember(user: User, org: Organization, userToAdd: string) {
    this.logger.debug(`Adding new organization's member (${user.email} - ${user._id}): +${userToAdd})`);
    this.logger.debug(org);
    const updatedOrg = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, owner: user}, {$addToSet: {members: userToAdd}}, {new: true}));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(updatedOrg.membersId, userToAdd, user._id));
    return updatedOrg;
  }

  public async addMemberWithEmail(user: User, org: Organization, body: InviteUserOrgBody) {
    this.logger.debug(`Adding new organization's member (${user.email} - ${user._id}): `)
    this.logger.debug(body);
    if (org.owner.email === body.memberEmail || org.members.some((member) => member.email === body.memberEmail))
      throw new BadRequestException('User already in organization !');
    const invitedUser: UserDocument = await this.userService.findByEmail(body.memberEmail);
    if (invitedUser === null)
      throw new BadRequestException(`can't found user email !`);
    const updatedOrg = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, owner: user}, {$addToSet: {members: invitedUser._id}}, {new: true}));
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(updatedOrg._id, invitedUser._id, user._id));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    return updatedOrg;
  }

  public async removeMember(user: User, org: Organization, body: RemoveUserOrgBody) {
    this.logger.debug(`Removing organization's member (${user.email} - ${user._id}): -${body.memberId}`);
    this.logger.debug(org);
    const updatedOrg = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, owner: user._id}, {$pull: {members: {$in: body.memberId}}}, {new: true}));
    this.eventEmitter.emit(OrgEvents.onMemberRemoved, new OrgRemoveMemberEvent(org._id, body.memberId, user._id));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    return updatedOrg;
  }

  public async removeMemberFromAllOrg(user: User) {
    await this.organizationModel.updateMany({members: {$in: [user]}}, {$pullAll: {members: [user]}}).exec();
  }

  public async migrate(user: User, org: Organization, body: MigrateOrganizationBody) {
    this.logger.debug(`Migrate organization's owner (${user.email} - ${user._id}): `);
    this.logger.debug(body);
    await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id}, {owner: body.newOwnerId,
      $pull: {
        members: body.newOwnerId,
      },
    }, {new: true}));
    return OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, $push: {members: [user._id.toString()]}}));
  }

  public addHistory(orgId: string, history: NewOrgHistory) {
    return OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: orgId}, {$push: {history}}, {new: true}));
  }

}
