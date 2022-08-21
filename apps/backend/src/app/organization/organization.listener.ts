import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {OrgAddMemberEvent, OrgEvents, OrgRemoveMemberEvent} from "./organization.event";
import {OrganizationService} from "./organization.service";
import {OrgHistoryAction} from "@pld/shared";

@Injectable()
export class OrganizationListener {

  constructor(private orgService: OrganizationService) {}

  @OnEvent(OrgEvents.onMemberAdded)
  public onMemberAdded(event: OrgAddMemberEvent) {
    this.orgService.addHistory(event.orgId, {
      owner: event.addedBy,
      action: OrgHistoryAction.ADD_MEMBER,
      member: event.newMemberId,
      date: new Date(),
    });
  }

  @OnEvent(OrgEvents.onMemberRemoved)
  public onMemberRemoved(event: OrgRemoveMemberEvent) {
    this.orgService.addHistory(event.orgId, {
      owner: event.removedBy,
      action: OrgHistoryAction.REMOVE_MEMBER,
      member: event.removedMemberId,
      date: new Date(),
    });
  }

}
