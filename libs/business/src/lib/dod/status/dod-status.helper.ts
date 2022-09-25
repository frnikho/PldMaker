import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { DodStatus, NewDodStatus, Organization, UpdateDodStatus, User } from "@pld/shared";
import { DodEvents, DodStatusDeletedEvent } from "../dod.event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class DodStatusHelper {

  constructor(@InjectModel('DodStatus') private dodStatusModal: Model<DodStatus>, private eventEmitter: EventEmitter2) {
  }

  public initializeDodStatus(user: User, org: Organization) {
    return this.dodStatusModal.create([{name: 'En cours', color: '3498db', org}, {name: 'À faire', color: '16a085', useDefault: true, org}, {name: 'Fini', color: '2ecc71', org}]);
  }

  public static populateAndExecute(query: Query<any, any>) {
    return query.populate('org').exec();
  }

  public getDodStatus(user: User, org: Organization) {
    return DodStatusHelper.populateAndExecute(this.dodStatusModal.find({org: org}));
  }

  public getDodStatusFromId(user: string, org: string) {
    return DodStatusHelper.populateAndExecute(this.dodStatusModal.find({org: org}));
  }

  public async createDodStatus(user: User, org: Organization, body: NewDodStatus) {
    if (body.useDefault)
      await this.dodStatusModal.updateMany({org: org, useDefault: true}, {useDefault: false}).exec();
    return this.dodStatusModal.create({...body, org: org});
  }

  public async updateDodStatus(user: User, org: Organization, dodStatus: DodStatus, body: UpdateDodStatus) {
    if (body.useDefault)
      await this.dodStatusModal.updateMany({org: org, useDefault: true}, {useDefault: false}).exec();
    return DodStatusHelper.populateAndExecute(this.dodStatusModal.findOneAndUpdate({_id: dodStatus._id, org: org}, {...body, updatedDate: new Date()}, {new: true}));
  }

  public async deleteDodStatus(user: User, org: Organization, dodStatus: DodStatus) {
    const existingStatus = await this.dodStatusModal.find({org: org, useDefault: false}).exec();
    if (dodStatus === undefined || existingStatus.length <= 1)
      throw new BadRequestException('You cannot delete your last dod status !');
    const deletedStatus = await DodStatusHelper.populateAndExecute(this.dodStatusModal.findOneAndDelete({_id: dodStatus._id, org: org}))
    this.eventEmitter.emit(DodEvents.onDodStatusDeleted, {dodStatusId: deletedStatus._id, orgId: org._id, removedBy: user._id} as DodStatusDeletedEvent);
    return deletedStatus;
  }

}
