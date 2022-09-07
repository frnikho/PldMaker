import {Injectable} from '@nestjs/common';
import { NewOrgHistory, OrganizationDocument } from "./organization.schema";
import { CreateOrganizationBody, InviteUserOrgBody, User, RemoveUserOrgBody, UpdateOrganizationBody } from "@pld/shared";
import { OrganizationHelper } from "./organization.helper";
import { Organization } from "@pld/shared";
import { CheckOrgPerm } from "./organization.util";

export type MemberUpdateObjects = string[];

@Injectable()
export class OrganizationService {

  constructor(private orgHelper: OrganizationHelper) {}

  public find(orgId: string) {
    return this.orgHelper.find(orgId);
  }

  public createByBody(user: User, org: CreateOrganizationBody) {
    return this.orgHelper.createOrgWithBody(user, org);
  }

  public create(user: User, org: Organization) {
    return this.orgHelper.createOrg(user, org);
  }

/*  public async delete(ownerId: string, orgObjectId: string) {
    /!*return this.organizationModel.findOneAndDelete({_id: orgObjectId, owner: ownerId})
      .exec();*!/
  }*/

  @CheckOrgPerm({role: 'owner'})
  public async deleteWithBody(user: User, org: Organization) {
    return this.orgHelper.deleteOrgWithBody(user, org);
  }

  public update(user: User, org: Organization) {
    //return this.orgHelper.update(user, org);
  }

  @CheckOrgPerm({role: 'owner'})
  public updateByBody(user: User, org: Organization, body: UpdateOrganizationBody) {
    return this.orgHelper.updateWithBody(user, org, body);
  }

  public getUserOrg(user: User) {
   return this.orgHelper.getUserOrg(user);
  }

  @CheckOrgPerm()
  public getOrg(user: User, org: Organization) {
    return org;
  }

  @CheckOrgPerm({role: 'owner'})
  public async addMember(user: User, org: Organization, userToAdd: string) {
    return this.orgHelper.addMember(user, org, userToAdd);
  }

  @CheckOrgPerm({role: 'owner'})
  public addMemberByEmail(user: User, org: Organization, body: InviteUserOrgBody) {
    return this.orgHelper.addMemberWithEmail(user, org, body);
  }

  @CheckOrgPerm({role: 'owner'})
  public async removeMember(user: User, org: Organization, body: RemoveUserOrgBody): Promise<OrganizationDocument | null> {
    return this.orgHelper.removeMember(user, org, body)
  }

  public addHistory(orgId: string, history: NewOrgHistory) {
    return this.orgHelper.addHistory(orgId, history);
  }

}
