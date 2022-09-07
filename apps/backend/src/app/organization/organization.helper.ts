import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NewOrgHistory } from "./organization.schema";
import { Model, Query } from "mongoose";
import { UserService } from "../user/user.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InviteUserOrgBody, Organization, RemoveUserOrgBody, UpdateOrganizationBody } from "@pld/shared";
import { CreateOrganizationBody, User } from "@pld/shared";
import { OrgAddMemberEvent, OrgEvents, OrgRemoveMemberEvent } from "./organization.event";
import { UserDocument } from "../user/user.schema";

@Injectable()
export class OrganizationHelper {

  constructor(
    @InjectModel('Organization') private organizationModel: Model<Organization>,
    private userService: UserService,
    private eventEmitter: EventEmitter2) {}


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

  public createOrg(user: User, org: Organization) {
    return this.organizationModel.create({ ...org });
  }

  public createOrgWithBody(user: User, body: CreateOrganizationBody) {
    return this.organizationModel.create({
      name: body.name,
      description: body.description,
      members: [],
      owner: user,
      versionShifting: body.versionShifting,
    });
  }

  public deleteOrgWithBody(user: User, org: Organization) {
    return OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndDelete({_id: org._id, owner: user._id}));
  }

  public async updateWithBody(user: User, org: Organization, body: UpdateOrganizationBody) {
    const updatedOrg: Organization = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id}, {...body, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    return updatedOrg;
  }

  public getUserOrg(user: User) {
    return OrganizationHelper.populateAndExecute<Organization[]>(this.organizationModel.find({$or: [{owner: user._id}, {members: {$in: user._id}}]}));
  }

  public async addMember(user: User, org: Organization, userToAdd: string) {
    const updatedOrg = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, owner: user}, {$addToSet: {members: userToAdd}}, {new: true}));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(updatedOrg.membersId, userToAdd, user._id));
    return updatedOrg;
  }

  public async addMemberWithEmail(user: User, org: Organization, body: InviteUserOrgBody) {
    const invitedUser: UserDocument = await this.userService.findByEmail(body.memberEmail);
    if (invitedUser === null)
      throw new BadRequestException(`can't found user email !`);
    const updatedOrg = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, owner: user}, {$addToSet: {members: user._id}}, {new: true}));
    this.eventEmitter.emit('Org:Update', updatedOrg._id);
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(updatedOrg._id, invitedUser._id, user._id));
    return updatedOrg;
  }

  public async removeMember(user: User, org: Organization, body: RemoveUserOrgBody) {
    const updatedOrg = await OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: org._id, owner: user._id}, {$pull: {members: {$in: body.memberId}}}, {new: true}));
    this.eventEmitter.emit(OrgEvents.onMemberRemoved, new OrgRemoveMemberEvent(org._id, body.memberId, user._id));
    return updatedOrg;
  }

  public addHistory(orgId: string, history: NewOrgHistory) {
    return OrganizationHelper.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: orgId}, {$push: {history}}, {new: true}));
  }

}
