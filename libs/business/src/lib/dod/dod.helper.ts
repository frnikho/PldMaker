import { EditedField, NewDodHistory } from "./dod.schema";
import { Model, Query } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Dod, DodCreateBody, DodUpdateBody, Organization, Pld, User } from "@pld/shared";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PldDodCreatedEvent, PldEvents } from "../pld/pld.event";
import { DodEvents, DodUpdateEvent } from "./dod.event";

export class DodHelper {

  constructor(
    @InjectModel('Dod') private dodModel: Model<Dod>,
    private eventEmitter: EventEmitter2) {
  }

  public static populateAndExecute(query: Query<any, any>) {
    return query.populate(['pldOwner', 'owner'])
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
    const createdDod = await this.dodModel.create({ ...body, status: org.dodColors[0].name });
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

  public addHistory(userId: string, history: NewDodHistory) {
    return DodHelper.populateAndExecute(this.dodModel.findOneAndUpdate({_id: history.dodId}, {$push: {history: {date: new Date(), editedFields: history.editedFields, owner: userId, action: history.action}}}, {new: true}));
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
