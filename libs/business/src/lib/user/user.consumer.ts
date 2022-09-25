import { OnQueueError, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserHelper } from "./user.helper";

@Processor('user')
export class UserConsumer {

  constructor(private userHelper: UserHelper) {

  }

  @Process('userDeletion')
  public deleteUser(job: Job) {

  }

  @OnQueueError()
  public onQueueError(error: Error) {
    console.log(error);
  }

}
