import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Organization, OrganizationDocument} from "./organization.schema";
import {Model, ObjectId} from "mongoose";
import {CreateOrganizationBody} from "../../../../../libs/data-access/organization/CreateOrganizationBody";
import {UserDocument} from "../user/user.schema";
import {UpdateOrganizationBody} from "../../../../../libs/data-access/organization/UpdateOrganizationBody";
import {DeleteOrganizationBody} from "../../../../../libs/data-access/organization/DeleteOrganizationBody";
import {UserService} from "../user/user.service";
import {InviteUserOrgBody} from "../../../../../libs/data-access/organization/ManageMembersOrganizationBody";

export type MemberUpdateObjects = UserDocument[] | string[] | ObjectId[];

@Injectable()
export class OrganizationService {

  constructor(@InjectModel(Organization.name) private organizationModel: Model<Organization>, private userService: UserService) {}

  public find(orgObjectId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOne({_id: orgObjectId})
      .populate(['owner', 'members'])
      .exec();
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
    return this.organizationModel.findOneAndUpdate({_id: orgId, owner: ownerId}, {...body, updated_date: new Date()}, {new: true})
      .populate(['owner', 'members'])
      .exec();
  }

  public findOrgsByAuthor(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({owner: userObjectId})
      .populate(['owner', 'members'])
      .exec();
  }

  public findOrgsByAuthorAndMembers(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({$or: [{owner: userObjectId}, {members: {$gt: userObjectId}}]})
      .populate(['owner', 'members'])
      .exec();
  }

  public findOrgsContainingMember(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({members: userObjectId})
      .populate(['owner', 'members'])
      .exec();
  }

  public async addMembers(orgId: string, ownerId: string, userId: MemberUpdateObjects): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndUpdate({_id: orgId, owner: ownerId}, {$addToSet: {members: userId}}, {new: true, populate: ['members', 'owner']})
      .exec();
  }

  public async addMembersByEmail(ownerId: string, body: InviteUserOrgBody): Promise<OrganizationDocument | null> {
    const user: UserDocument | null = await this.userService.findByEmail(body.memberEmail);
    if (user === null)
      throw new BadRequestException(`can't found user email !`);
    return this.organizationModel.findOneAndUpdate({_id: body.orgId, owner: ownerId}, {$addToSet: {members: user._id}}, {new: true, populate: ['members', 'owner']})
      .exec();
  }

  public async removeMembers(orgId: string, ownerId: string, userId: MemberUpdateObjects): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndUpdate({_id: orgId, owner: ownerId}, {$pull: {members: {$in: userId}}}, {new: true, populate: ['members', 'owner']})
      .exec();
  }

}
