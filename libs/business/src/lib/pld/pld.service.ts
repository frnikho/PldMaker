import { Injectable } from '@nestjs/common';
import {NewPldHistory} from "./pld.schema";
import { PldOrgCreateBody, CreatePldRevisionBody, PldUpdateBody, Pld, Organization, User } from "@pld/shared";
import {PldHelper} from "./pld.helper";

@Injectable()
export class PldService {

  constructor(
    private helper: PldHelper) {}


  public async create(pld: Pld) {
    return this.helper.create(pld);
  }

  public async createForOrgWithBody(user: User, org: Organization, body: PldOrgCreateBody) {
    return this.helper.createWithBody(user, org, body);
  }

  public async find(pldId: string) {
    return this.helper.find(pldId);
  }

  public async findPld(user: User, org: Organization, pld: Pld) {
    return pld;
  }

  public async findByOrganizationOwner(user: User, org: Organization) {
    return this.helper.getOrgPld(user, org);
  }

  public async updateWithBody(user: User, org: Organization, pld: Pld, body: PldUpdateBody) {
    return this.helper.updateWithBody(user, org, pld, body);
  }

/*  public async update(pldId: string, ownerId: string, pld: PldDocument): Promise<PldDocument | null> {
    const updatedPld = await this.populateAndExecute(this.pldModel.findOneAndUpdate({_id: pldId, owner: ownerId}, {...pld, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldUpdate, new PldUpdatedEvent(ownerId, pldId, []));
    return updatedPld;
  }*/

  public async delete(user: User, org: Organization, pld: Pld) {
    return this.helper.delete(user, org, pld)
  }

  public async addRevision(user: User, org: Organization, pld: Pld, body: CreatePldRevisionBody) {
    return this.helper.addRevision(user, org, pld, body);
  }

  public async addHistory(userId: string, history: NewPldHistory) {
    return this.helper.addHistory(userId, history);
  }
}
