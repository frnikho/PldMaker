import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {NewOrgHistory, Organization, OrganizationDocument} from "./organization.schema";
import {Model, Query} from "mongoose";
import {CreateOrganizationBody, UpdateOrganizationBody, DeleteOrganizationBody, InviteUserOrgBody} from "@pld/shared";
import {UserDocument} from "../user/user.schema";
import {UserService} from "../user/user.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import {OrgAddMemberEvent, OrgEvents} from "./organization.event";

export type MemberUpdateObjects = string[];

@Injectable()
export class OrganizationService {

  constructor(@InjectModel(Organization.name) private organizationModel: Model<Organization>, private userService: UserService, private eventEmitter: EventEmitter2) {}

  private populateAndExecute(query: Query<any, any>) {
    return query.populate(['owner', 'members'])
      .populate({
        path: 'history',
        populate: [{
          path: 'owner'
        }, {
          path: 'member'
        }]
      }).exec();
  }

  public find(orgObjectId: string): Promise<OrganizationDocument | null> {
    return this.populateAndExecute(this.organizationModel.findOne({_id: orgObjectId}));
  }

  public createByBody(org: CreateOrganizationBody, ownerId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.create({
      name: org.name,
      description: org.description,
      members: [],
      owner: ownerId,
      versionShifting: org.versionShifting,
    });
  }

  public create(org: Organization): Promise<OrganizationDocument> {
    return this.organizationModel.create(org);
  }

  public async delete(ownerId: string, orgObjectId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndDelete({_id: orgObjectId, owner: ownerId})
      .exec();
  }

  public async deleteByBody(owner: string | UserDocument, body: DeleteOrganizationBody): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndDelete({_id: body.orgId, owner}).exec();
  }

  public update(orgObjectId: string, ownerId: string, org: Organization): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndUpdate({_id: orgObjectId, owner: ownerId}, org, {new: true})
      .populate(['owner', 'members'])
      .exec();
  }

  public updateByBody(ownerId: string, body: UpdateOrganizationBody) {
    const orgId = body.orgId;
    delete body.orgId;
    return this.organizationModel.findOneAndUpdate({_id: orgId}, {...body, updated_date: new Date()}, {new: true})
      .populate(['owner', 'members'])
      .exec();
  }

  public findOrgsByAuthor(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({owner: userObjectId})
      .populate(['owner', 'members'])
      .exec();
  }

  public findOrgsByAuthorAndMembers(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({$or: [{owner: userObjectId}, {members: {$in: userObjectId}}]})
      .populate(['owner', 'members'])
      .exec();
  }

  public findOrgsContainingMember(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({members: userObjectId})
      .populate(['owner', 'members'])
      .exec();
  }

  public async addMembers(orgId: string, ownerId: string, userId: MemberUpdateObjects): Promise<OrganizationDocument | null> {
    const org = await this.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: orgId, owner: ownerId}, {$addToSet: {members: userId}}, {new: true}));
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(orgId, userId[0], ownerId));
    return org;
  }

  public async addMembersByEmail(ownerId: string, body: InviteUserOrgBody): Promise<OrganizationDocument | null> {
    const user: UserDocument | null = await this.userService.findByEmail(body.memberEmail);
    if (user === null)
      throw new BadRequestException(`can't found user email !`);
    const org = await this.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: body.orgId, owner: ownerId}, {$addToSet: {members: user._id}}, {new: true}));
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(body.orgId, user._id, ownerId));
    return org;
  }

  public async removeMembers(orgId: string, ownerId: string, userId: MemberUpdateObjects): Promise<OrganizationDocument | null> {
    const org = await this.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: orgId, owner: ownerId}, {$pull: {members: {$in: userId}}}, {new: true}));
    this.eventEmitter.emit(OrgEvents.onMemberAdded, new OrgAddMemberEvent(orgId, userId[0], ownerId));
    return org;
  }

  public addHistory(orgId: string, history: NewOrgHistory) {
    return this.populateAndExecute(this.organizationModel.findOneAndUpdate({_id: orgId}, {$push: {history}}, {new: true}));
  }

}
