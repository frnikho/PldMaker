import { EditedField, NewDodHistory } from "./dod.schema";
import { Model, Query } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Dod, DodCreateBody, DodUpdateBody, Organization, Pld, SetDodStatus, User } from "@pld/shared";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PldDodCreatedEvent, PldEvents } from "../pld/pld.event";
import { DodEvents, DodUpdateEvent } from "./dod.event";
import { DodStatusHelper } from "./status/dod-status.helper";
import { BadRequestException, Logger } from "@nestjs/common";

export class DodHelper {

  constructor(
    @InjectModel('Dod') private dodModel: Model<Dod>,
    private eventEmitter: EventEmitter2,
    private dodStatusHelper: DodStatusHelper) {
  }

  public static populateAndExecute(query: Query<any, any>) {
    return query.populate(['pldOwner', 'owner', 'status'])
      .populate({
        path: 'estimatedWorkTime',
        populate: {
          path: 'users',
          model: 'User'
        }
      })
      .populate({
        path: 'history',
        populate: [{
          path: 'owner',
          model: 'User'
        }]
      }).exec();
  }

  public async createWithBody(user: User, org: Organization, pld: Pld, body: DodCreateBody) {
    const dodColors = (await this.dodStatusHelper.getDodStatus(user, org)).find((a) => a.useDefault);
    console.log(dodColors);
    if (dodColors === undefined) {
      throw new BadRequestException('You don`t have any dod status !');
    }
    const createdDod = await this.dodModel.create({ ...body, status: dodColors});
    this.eventEmitter.emit(PldEvents.onDodCreated, new PldDodCreatedEvent(user._id.toString(), pld._id, createdDod._id.toString()));
    this.eventEmitter.emit('Dod:Update', pld._id);
    return createdDod;
  }

  public getPldDod(user: User, org: Organization, pld: Pld) {
    return DodHelper.populateAndExecute(this.dodModel.find({pldOwner: pld}));
  }

  public async update(user: User, org: Organization, pld: Pld, dod: Dod, body: DodUpdateBody) {
    const updatedDod = await DodHelper.populateAndExecute(this.dodModel.findOneAndUpdate({_id: dod._id, pldOwner: pld}, {...body}, {new: true}));
    this.eventEmitter.emit('Dod:Update', pld._id);
    this.eventEmitter.emit(DodEvents.onDodUpdate, {editedDod: dod._id, editedBy: user._id, editedFields: this.getEditedFields(dod, updatedDod)} as DodUpdateEvent)
    return updatedDod;
  }

  public async delete(user: User, org: Organization, pld: Pld, dod: Dod) {
    return DodHelper.populateAndExecute(this.dodModel.findOneAndDelete({_id: dod._id, pldOwner: pld}));
  }

  public async updateDodStatus(user: User, org: Organization, pld: Pld, dod: Dod, body: SetDodStatus) {
    const updatedDodStatus = await DodHelper.populateAndExecute(this.dodModel.findOneAndUpdate({_id: dod._id, pldOwner: pld}, {status: body.statusId}, {new: true}));
    this.eventEmitter.emit('Dod:Update', pld._id);
    this.eventEmitter.emit(DodEvents.onDodUpdate, {editedDod: dod._id, editedBy: user._id, editedFields: this.getEditedFields(dod, updatedDodStatus)} as DodUpdateEvent)
    return updatedDodStatus;
  }

  public addHistory(userId: string, history: NewDodHistory) {
    return DodHelper.populateAndExecute(this.dodModel.findOneAndUpdate({_id: history.dodId}, {$push: {history: {date: new Date(), editedFields: history.editedFields, owner: userId, action: history.action}}}, {new: true}));
  }

  public async migrateAllDodStatus(userId: string, orgId: string, statusId: string) {
    const dodStatus = await this.dodStatusHelper.getDodStatusFromId(userId, orgId);
    const dodStatusToReplace = dodStatus.find((a) => a.useDefault);
    if (!dodStatusToReplace)
      return Logger.error('Business error ! org must contains a least one default status !');
    await this.dodModel.updateMany({status: statusId.toString()}, {status: dodStatusToReplace}).exec();
  }

  public getEditedFields(beforeDod: Dod, updatedDod: Dod): EditedField[] {
    const editedFields: EditedField[] = [];
    const fields = ['description', 'title', 'skinOf', 'want', 'version']
    fields.forEach((field) => {
      console.log(beforeDod[field], updatedDod[field]);
      if (beforeDod[field] !== updatedDod[field]) {
        editedFields.push({
          name: field,
          value: updatedDod[field],
          lastValue: beforeDod[field],
        })
      }
    })
    if (beforeDod.estimatedWorkTime !== updatedDod.estimatedWorkTime) {
      //TODO
    }
    if (beforeDod.descriptionOfDone.join(', ') !== updatedDod.descriptionOfDone.join(', ')) {
      editedFields.push({
        name: 'descriptionOfDone',
        value: updatedDod.descriptionOfDone.join(', '),
        lastValue: beforeDod.descriptionOfDone.join(', '),
      })
    }
    return editedFields;
  }

}
