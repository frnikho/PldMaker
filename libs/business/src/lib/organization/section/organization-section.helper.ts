import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { Organization, OrganizationSectionBody, User, OrganizationSection, OrganizationSectionUpdateBody } from "@pld/shared";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class OrganizationSectionHelper {

  constructor(@InjectModel('OrganizationSection') private orgSection: Model<OrganizationSection>, private eventEmitter: EventEmitter2) {
  }

  public static populateAndExecute(query: Query<any, any>) {
    return query.exec();
  }

  public getSections(user: User, org: Organization) {
    return OrganizationSectionHelper.populateAndExecute(this.orgSection.find({org: org}));
  }

  public async createSection(user: User, org: Organization, body: OrganizationSectionBody) {
    const section = await this.orgSection.create({...body, owner: user, org: org});
    this.eventEmitter.emit('Org:Update', org._id);
    return section;
  }

  public async deleteSection(user: User, org: Organization, section: OrganizationSection) {
    const deletedSection = await OrganizationSectionHelper.populateAndExecute(this.orgSection.findOneAndDelete({_id: section._id}));
    this.eventEmitter.emit('Org:Update', org._id);
    return deletedSection;
  }

  public async updateSection(user: User, org: Organization, section: OrganizationSection, body: OrganizationSectionUpdateBody) {
    const updatedSection = await OrganizationSectionHelper.populateAndExecute(this.orgSection.findOneAndUpdate({_id: section._id}, {name: body.name}, {new: true}));
    this.eventEmitter.emit('Org:Update', org._id);
    return updatedSection;
  }

}
