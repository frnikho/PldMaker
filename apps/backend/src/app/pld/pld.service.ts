import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {NewPldHistory, Pld, PldDocument} from "./pld.schema";
import {Model, Query} from "mongoose";
import {PldOwnerType} from "../../../../../libs/data-access/pld/PldOwnerType";
import {PldOrgCreateBody} from "../../../../../libs/data-access/pld/PldBody";
import {PldStatus} from "../../../../../libs/data-access/pld/PldStatus";
import {CreatePldRevisionBody} from "../../../../../libs/data-access/pld/Pld";
import {User} from "../user/user.schema";
import {PldUpdateBody} from "../../../../../libs/data-access/pld/PldUpdateBody";
import { EventEmitter2 } from '@nestjs/event-emitter';
import {PldEvents, PldRevisionAddedEvent, PldUpdatedEvent} from "./pld.event";
import {Dod, EditedField} from "../dod/dod.schema";
import {PldHelper} from "./pld.helper";

@Injectable()
export class PldService {

  constructor(
    @InjectModel(Pld.name) private pldModel: Model<Pld>,
    private eventEmitter: EventEmitter2,
    private helper: PldHelper) {}

  private populateAndExecute(query: Query<any, any>) {
    return query.populate(['owner', 'manager'])
      .populate({
        path: 'revisions',
        populate: {
          path: 'owner',
          model: User.name
        },
      })
      .populate({
        path: 'history',
        populate: [{
          path: 'owner',
          model: User.name
        }, {
          path: 'dod',
          model: Dod.name
        }]
      })
      .exec();
  }

  public async create(pld: Pld): Promise<PldDocument> {
    return this.pldModel.create(pld);
  }

  public async createForOrgWithBody(pldBody: PldOrgCreateBody) {
    return this.pldModel.create({
      owner: pldBody.owner,
      ownerType: PldOwnerType.Organization,
      revisionsUpdated: [],
      promotion: pldBody.promotion,
      manager: pldBody.manager,
      status: PldStatus.edition,
      version: pldBody.version,
      description: pldBody.description,
      title: pldBody.title,
      tags: pldBody.tags,
      steps: pldBody.steps,
      endingDate: pldBody.endingDate,
      startingDate: pldBody.startingDate,
    })
  }

  public async find(pldId: string): Promise<PldDocument | null> {
    return this.populateAndExecute(this.pldModel.findOne({_id: pldId}));
  }

  public async findByOrganizationOwner(orgId: string[]): Promise<PldDocument[] | null> {
    return this.populateAndExecute(this.pldModel.find({ownerType: PldOwnerType.Organization, owner: {$in: orgId}}));
  }

  public async updateWithBody(ownerId: string, body: PldUpdateBody) {
    const beforePld = await this.populateAndExecute(this.pldModel.findOne({_id: body.pldId}));
    const pldUpdated = await this.populateAndExecute(this.pldModel.findOneAndUpdate({_id: body.pldId}, {updated_date: new Date(), title: body.title, description: body.description, manager: body.manager, promotion: body.promotion, currentStep: body.currentStep}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldUpdate, new PldUpdatedEvent(ownerId, body.pldId, this.helper.getEditedFields(beforePld, pldUpdated)));
    return pldUpdated;
  }

  public async getPld(userId: string) {

  }

  public async update(pldId: string, ownerId: string, pld: PldDocument): Promise<PldDocument | null> {
    const updatedPld = await this.populateAndExecute(this.pldModel.findOneAndUpdate({_id: pldId, owner: ownerId}, {...pld, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldUpdate, new PldUpdatedEvent(ownerId, pldId, []));
    return updatedPld;
  }

  public async delete(pldId: string, ownerId: string): Promise<PldDocument | null> {
    return this.populateAndExecute(this.pldModel.findOneAndDelete({_id: pldId, owner: ownerId}));
  }

  public async addRevision(pldId: string, body: CreatePldRevisionBody) {
    const updatedPld = await this.populateAndExecute(this.pldModel.findOneAndUpdate({_id: pldId}, {$addToSet: {revisions: body}, version: body.version, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldRevisionAdded, new PldRevisionAddedEvent(body.owner, pldId, updatedPld.revisions[0]));
    return updatedPld;
  }

  public async addHistory(ownerId: string, history: NewPldHistory) {
    return this.populateAndExecute(this.pldModel.findOneAndUpdate({_id: history.pldId}, {$push:
        {
          history: {
            date: new Date(),
            owner: ownerId,
            action: history.action,
            dod: history.dod,
            revision: history.revision,
            editedFields: history.editedFields,
          }
        }
    }));
  }
}
