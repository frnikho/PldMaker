import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Dod, NewDodHistory} from "./dod.schema";
import {Model, Query} from "mongoose";
import {DodCreateBody} from "@pld/shared";
import {DodStatus} from "@pld/shared";
import {EventEmitter2} from "@nestjs/event-emitter";
import {DodEvents, DodUpdateEvent} from "./dod.event";
import {PldDodCreatedEvent, PldDodDeletedEvent, PldEvents} from "../pld/pld.event";
import {User} from "../user/user.schema";
import {DodHelper} from "./dod.helper";

@Injectable()
export class DodService {

  constructor(
    @InjectModel(Dod.name) private dodModel: Model<Dod>,
    private eventEmitter: EventEmitter2,
    private helper: DodHelper) {}

  private populateAndExecute(query: Query<any, any>) {
    return query.populate(['pldOwner', 'owner'])
      .populate({
        path: 'estimatedWorkTime',
        populate: {
          path: 'users',
          model: User.name
        }
      })
      .populate({
        path: 'history',
        populate: [{
          path: 'owner',
          model: User.name
        }]
      }).exec();
  }

  public async createFromBody(dodBody: DodCreateBody) {
    const dodCreated = await this.dodModel.create({
      ...dodBody,
      estimatedWorkTime: dodBody.estimatedWorkTime.map((wt) => (wt))
    });
    this.eventEmitter.emit(PldEvents.onDodCreated, new PldDodCreatedEvent(dodBody.owner, dodBody.pldOwner, dodCreated._id.toString()));
    return dodCreated;
  }

  public async create(dod: Dod) {
    return this.dodModel.create(dod);
  }

  public async find(id: string) {
    return this.populateAndExecute(this.dodModel.findOne({_id: id}));
  }

  public async findByPldId(pldId: string[]) {
    return this.populateAndExecute(this.dodModel.find({pldOwner: {$in: pldId}}));
  }

  public async delete(id: string) {
    const deleteDod = await this.populateAndExecute(this.dodModel.findOneAndDelete({_id: id}));
    this.eventEmitter.emit(PldEvents.onDodCreated, new PldDodDeletedEvent(deleteDod.owner._id, deleteDod.pldOwner._id, id));
    return deleteDod;
  }

  /**
   * Update the status of a dod (A faire, Fini ...)
   * @param ownerId
   * @param id
   * @param status
   * @return Return the old dod content if updated
   */
  public async updateStatus(ownerId: string, id: string, status: DodStatus) {
    const updated = await this.populateAndExecute(this.dodModel.findOneAndUpdate({_id: id}, {status: status}, {new: false}));
    if (status !== updated.status)
      this.eventEmitter.emit(DodEvents.onDodUpdate, new DodUpdateEvent(ownerId, [{name: 'status', lastValue: updated.status, value: status}], id));
    return updated;
  }

  public async update(ownerId: string, dodId: string, body: DodCreateBody) {
    const beforeUpdate = await this.populateAndExecute(this.dodModel.findOne({_id: dodId}));
    const afterUpdate = await this.populateAndExecute(this.dodModel.findOneAndUpdate({_id: dodId}, {...body, updated_date: new Date()}, {new: true}))
    this.eventEmitter.emit(DodEvents.onDodUpdate, new DodUpdateEvent(ownerId, this.helper.getEditedFields(beforeUpdate, afterUpdate), afterUpdate._id));
    return afterUpdate;
  }

  /**
   * Add a history to the current dod
   * @param ownerId
   * @param history
   */
  public async addHistory(ownerId: string, history: NewDodHistory) {
    return this.populateAndExecute(this.dodModel.findOneAndUpdate({_id: history.dodId}, {$push: {history: {date: new Date(), editedFields: history.editedFields, owner: ownerId, action: history.action}}}, {new: true}));
  }

}
