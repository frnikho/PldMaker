import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { Organization, OrganizationSectionBody, User, OrganizationSection, OrganizationSectionUpdateBody } from "@pld/shared";

@Injectable()
export class OrganizationSectionHelper {

  constructor(@InjectModel('OrganizationSection') private orgSection: Model<OrganizationSection>) {
  }

  public static populateAndExecute(query: Query<any, any>) {
    return query.exec();
  }

  public getSections(user: User, org: Organization) {
    return OrganizationSectionHelper.populateAndExecute(this.orgSection.find({org: org}));
  }

  public createSection(user: User, org: Organization, body: OrganizationSectionBody) {
    return this.orgSection.create({...body, owner: user, org: org});
  }

  public deleteSection(user: User, org: Organization, section: OrganizationSection) {
    return OrganizationSectionHelper.populateAndExecute(this.orgSection.findOneAndDelete({_id: section._id}));
  }

  public updateSection(user: User, org: Organization, section: OrganizationSection, body: OrganizationSectionUpdateBody) {
    return OrganizationSectionHelper.populateAndExecute(this.orgSection.findOneAndUpdate({_id: section._id}, {name: body.name}, {new: true}));
  }

}
