import { Injectable } from "@nestjs/common";
import { OrganizationSectionHelper } from "./organization-section.helper";
import { Organization, OrganizationSectionBody, OrganizationSection, User, OrganizationSectionUpdateBody } from "@pld/shared";
import { CheckOrgPerm } from "../organization.util";

@Injectable()
export class OrganizationSectionService {

  constructor(private orgHelper: OrganizationSectionHelper) {}

  @CheckOrgPerm()
  public getSections(user: User, org: Organization) {
    return this.orgHelper.getSections(user, org);
  }

  @CheckOrgPerm()
  public createSection(user: User, org: Organization, body: OrganizationSectionBody) {
    return this.orgHelper.createSection(user, org, body);
  }

  public deleteSection(user: User, org: Organization, section: OrganizationSection) {
    return this.orgHelper.deleteSection(user, org, section);
  }

  public updateSection(user: User, org: Organization, section: OrganizationSection, body: OrganizationSectionUpdateBody) {
    return this.orgHelper.updateSection(user, org, section, body);
  }

}
