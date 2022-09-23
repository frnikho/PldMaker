import {Injectable} from "@nestjs/common";
import { Dod, EditedField } from "../dod/dod.schema";
import { NewPldHistory } from "./pld.schema";
import { Model, Query } from "mongoose";
import { CreatePldRevisionBody, Organization, Pld, PldOrgCreateBody, PldStatus, PldUpdateBody, UpdatePldRevisionBody, User } from "@pld/shared";
import { InjectModel } from "@nestjs/mongoose";
import { PldEvents, PldRevisionAddedEvent, PldUpdatedEvent } from "./pld.event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class PldHelper {

  constructor(
    @InjectModel('Pld') private pldModel: Model<Pld>,
    private eventEmitter: EventEmitter2) {}

  public static populateAndExecute<T>(query: Query<T, any>) {
    return query.populate(['owner', 'manager'])
      .populate({
        path: 'revisions',
        populate: {
          path: 'owner',
          model: 'User',
        },
      })
      .populate({
        path: 'history',
        populate: [{
          path: 'owner',
          model: 'User'
        }, {
          path: 'dod',
          model: Dod.name
        }]
      })
      .exec();
  }

  public create(pld: Pld) {
    return this.pldModel.create({...pld});
  }

  public createWithBody(user: User, org: Organization, body: PldOrgCreateBody) {
    return this.pldModel.create({owner: user._id, org: org._id,
      revisionsUpdated: [],
      promotion: body.promotion,
      manager: body.manager,
      status: PldStatus.edition,
      version: body.version,
      description: body.description,
      title: body.title,
      tags: body.tags,
      steps: body.steps,
      endingDate: body.endingDate,
      startingDate: body.startingDate,});
  }

  public find(pldId: string) {
    return PldHelper.populateAndExecute(this.pldModel.findOne({_id: pldId}));
  }

  public getOrgPld(user: User, org: Organization) {
    return PldHelper.populateAndExecute(this.pldModel.find({org: org._id}));
  }

  public async updateWithBody(user: User, org: Organization, pld: Pld, body: PldUpdateBody) {
    const pldUpdated = await PldHelper.populateAndExecute(this.pldModel.findOneAndUpdate({_id: pld._id}, {updated_date: new Date(), title: body.title, description: body.description, manager: body.manager, promotion: body.promotion, currentStep: body.currentStep}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldUpdate, new PldUpdatedEvent(user._id, body.pldId, this.getEditedFields(pld, pldUpdated)));
    this.eventEmitter.emit('Pld:Update', body.pldId); //TODO Check useless of this
    return pldUpdated;
  }

  public delete(user: User, org: Organization, pld: Pld) {
    return PldHelper.populateAndExecute(this.pldModel.findOneAndDelete({_id: pld._id, org: org._id, owner: user._id}));
  }

  public async addRevision(user: User, org: Organization, pld: Pld, body: CreatePldRevisionBody) {
    const updatedPld = await PldHelper.populateAndExecute(this.pldModel.findOneAndUpdate({_id: pld._id}, {$addToSet: {revisions: body}, version: body.version, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldRevisionAdded, new PldRevisionAddedEvent(body.owner, pld._id, updatedPld.revisions[0]));
    this.eventEmitter.emit('Pld:Update', pld._id);
    return updatedPld;
  }

  public async editRevision(user: User, org: Organization, pld: Pld, body: UpdatePldRevisionBody): Promise<Pld> {
    await this.pldModel.find({_id: pld._id}).updateOne({'revisions.version': body.version}, {'$set': {
        'revisions.$.comments': body.comments,
        'revisions.$.sections': body.sections,
        'revisions.$.owner': user._id.toString(),
        'revisions.$.created_date': new Date(),
      }}).exec();
    this.eventEmitter.emit('Pld:Update', pld._id);
    return this.find(pld._id);
  }

  public async addHistory(userId: string, history: NewPldHistory) {
    return PldHelper.populateAndExecute(this.pldModel.findOneAndUpdate({_id: history.pldId}, {$push:
        {
          history: {
            date: new Date(),
            owner: userId,
            action: history.action,
            dod: history.dod,
            revision: history.revision,
            editedFields: history.editedFields,
          }
        }
    }))
  }

  public getEditedFields(beforePld: Pld, updatedPld: Pld): EditedField[] {
    const editedFields: EditedField[] = [];
    const fields = ['description', 'title', 'currentStep', 'promotion', 'status'];
    fields.forEach((field) => {
      if (beforePld[field] !== updatedPld[field]) {
        editedFields.push({
          name: field,
          lastValue: beforePld[field],
          value: updatedPld[field],
        })
      }
    });
    if (beforePld.manager.email !== updatedPld.manager.email) {
      editedFields.push({
        name: 'manager',
        lastValue: beforePld.manager.email,
        value: updatedPld.manager.email
      })
    }
    return editedFields;
  }
}
