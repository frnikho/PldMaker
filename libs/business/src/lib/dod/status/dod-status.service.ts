import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { DodStatus, NewDodStatus, Organization, UpdateDodStatus, User } from "@pld/shared";
import { DodStatusHelper } from "./dod-status.helper";

@Injectable()
export class DodStatusService {

  constructor(private dodStatusHelper: DodStatusHelper) {
  }

  public initializeDodStatus(user: User, org: Organization) {
    return this.dodStatusHelper.initializeDodStatus(user, org);
  }

  public getDodStatus(user: User, org: Organization) {
    return this.dodStatusHelper.getDodStatus(user, org);
  }

  public createDodStatus(user: User, org: Organization, body: NewDodStatus) {
    return this.dodStatusHelper.createDodStatus(user, org, body);
  }

  public updateDodStatus(user: User, org: Organization, dodStatus: DodStatus, body: UpdateDodStatus) {
    return this.dodStatusHelper.updateDodStatus(user, org, dodStatus, body);
  }

  public deleteDodStatus(user: User, org: Organization, dodStatus: DodStatus) {
    return this.dodStatusHelper.deleteDodStatus(user, org, dodStatus);
  }

}
