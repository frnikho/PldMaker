import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Organization, OrganizationDocument} from "./organization.schema";
import {Model} from "mongoose";
import {CreateOrganizationBody} from "../../../../../libs/data-access/organization/CreateOrganizationBody";

@Injectable()
export class OrganizationService {

  constructor(@InjectModel(Organization.name) private organizationModel: Model<Organization>) {}

  public find(orgObjectId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOne({_id: orgObjectId})
      .populate('owner')
      .populate('members')
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

  public delete(orgObjectId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndDelete({_id: orgObjectId})
      .exec();
  }

  public update(orgObjectId: string, org: Organization): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndUpdate({_id: orgObjectId}, org, {new: true})
      .populate('owner')
      .populate('members')
      .exec();
  }

  public findOrgsByAuthor(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({owner: userObjectId})
      .populate('owner')
      .populate('members')
      .exec();
  }

  public findOrgsContainingMember(userObjectId: string): Promise<OrganizationDocument[] | null> {
    return this.organizationModel.find({members: userObjectId})
      .populate('owner')
      .populate('members')
      .exec();
  }

  public async addMember(orgId: string, userId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndUpdate({_id: orgId}, {$addToSet: {members: userId}}, {new: true, populate: ['members', 'owner']})
      .exec();
  }

  public async removeMember(orgId: string, userId: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOneAndUpdate({_id: orgId}, {$pull: {members: userId}}, {new: true, populate: ['members', 'owner']})
      .exec();
  }

}
