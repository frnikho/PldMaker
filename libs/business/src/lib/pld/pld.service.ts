import { Injectable } from '@nestjs/common';
import {NewPldHistory} from "./pld.schema";
import { PldOrgCreateBody, CreatePldRevisionBody, PldUpdateBody, Pld, Organization, User, UpdatePldRevisionBody } from "@pld/shared";
import {PldHelper} from "./pld.helper";
import { CheckOrgPerm } from "../organization/organization.util";
import { CheckPld } from "./pld.util";

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

  @CheckOrgPerm()
  @CheckPld()
  public async findPld(user: User, org: Organization, pld: Pld) {
    return pld;
  }

  @CheckOrgPerm()
  public async findByOrganizationOwner(user: User, org: Organization) {
    return this.helper.getOrgPld(user, org);
  }

  @CheckOrgPerm()
  @CheckPld()
  public async updateWithBody(user: User, org: Organization, pld: Pld, body: PldUpdateBody) {
    return this.helper.updateWithBody(user, org, pld, body);
  }

/*  public async update(pldId: string, ownerId: string, pld: PldDocument): Promise<PldDocument | null> {
    const updatedPld = await this.populateAndExecute(this.pldModel.findOneAndUpdate({_id: pldId, owner: ownerId}, {...pld, updated_date: new Date()}, {new: true}));
    this.eventEmitter.emit(PldEvents.onPldUpdate, new PldUpdatedEvent(ownerId, pldId, []));
    return updatedPld;
  }*/

  @CheckOrgPerm()
  @CheckPld()
  public async delete(user: User, org: Organization, pld: Pld) {
    return this.helper.delete(user, org, pld)
  }

  @CheckOrgPerm()
  @CheckPld()
  public async addRevision(user: User, org: Organization, pld: Pld, body: CreatePldRevisionBody) {
    return this.helper.addRevision(user, org, pld, body);
  }

  @CheckOrgPerm()
  @CheckPld()
  public async editRevision(user: User, org: Organization, pld: Pld, body: UpdatePldRevisionBody) {
    return this.helper.editRevision(user, org, pld, body);
  }

  public async addHistory(userId: string, history: NewPldHistory) {
    return this.helper.addHistory(userId, history);
  }
}
