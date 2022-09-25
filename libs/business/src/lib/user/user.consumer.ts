import { OnQueueError, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserHelper } from "./user.helper";
import { CalendarHelper } from "../organization/calendar/calendar.helper";
import { DodHelper } from "../dod/dod.helper";
import { PldHelper } from "../pld/pld.helper";
import { OrganizationHelper } from "../organization/organization.helper";
import { Express } from "express";

@Processor('user')
export class UserConsumer {

  constructor(private userHelper: UserHelper,
              private orgHelper: OrganizationHelper,
              private calendarHelper: CalendarHelper,
              private pldHelper: PldHelper,
              private dodHelper: DodHelper) {}

  @Process('delete')
  public async deleteUser(job: Job) {
    console.log('User Deleted consumer');
    //this.calendarHelper.deleteAllUserEvents(job.data.user);
    this.dodHelper.migrateAllUserDod(job.data.user);
    this.pldHelper.migrateAllUserPld(job.data.user);
    this.orgHelper.removeMemberFromAllOrg(job.data.user);
  }

  @Process('uploadProfilePicture')
  public async uploadProfilePicture(job: Job) {
    this.userHelper.changeUserProfile(job.data.user, job.data.file);
  }

  @OnQueueError()
  public onQueueError(error: Error) {
    console.log(error);
  }

}
