import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {NewDodHistory} from "./dod.schema";
import {Model} from "mongoose";
import { Dod, DodCreateBody, DodUpdateBody, Organization, Pld, SetDodStatus, User } from "@pld/shared";
import {EventEmitter2} from "@nestjs/event-emitter";
import {DodHelper} from "./dod.helper";

@Injectable()
export class DodService {

  constructor(
    @InjectModel('Dod') private dodModel: Model<Dod>,
    private eventEmitter: EventEmitter2,
    private helper: DodHelper) {}

  public async createWithBody(user: User, org: Organization, pld: Pld, body: DodCreateBody) {
    return this.helper.createWithBody(user, org, pld, body);
  }

  public async getPldDod(user: User, org: Organization, pld: Pld) {
    return this.helper.getPldDod(user, org, pld);
  }

  public async updateDodStatus(user: User, org: Organization, pld: Pld, dod: Dod, body: SetDodStatus) {
    return this.helper.updateDodStatus(user, org, pld, dod, body);
  }

  public async getDod(user: User, org: Organization, pld: Pld, dod: Dod) {
    return dod;
  }

  public async update(user: User, org: Organization, pld: Pld, dod: Dod, body: DodUpdateBody) {
    return this.helper.update(user, org, pld, dod, body);
  }

  public async delete(user: User, org: Organization, pld: Pld, dod: Dod) {
    return this.helper.delete(user, org, pld, dod);
  }

  /**
   * Add a history to the current dod
   * @param userId
   * @param history
   */
  public async addHistory(userId: string, history: NewDodHistory) {
    return this.helper.addHistory(userId, history);
  }

  public migrateAllDodStatus(userId: string, orgId: string, statusId: string) {
    return this.helper.migrateAllDodStatus(userId, orgId, statusId);
  }

}
