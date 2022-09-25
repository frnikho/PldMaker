import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import { OrgAddMemberEvent, OrgDodStatusDeletedEvent, OrgEvents, OrgRemoveMemberEvent } from "./organization.event";
import {OrganizationService} from "./organization.service";
import {OrgHistoryAction} from "@pld/shared";

@Injectable()
export class OrganizationListener {

  constructor(private orgService: OrganizationService) {}

  @OnEvent(OrgEvents.onMemberAdded)
  public onMemberAdded(event: OrgAddMemberEvent) {
    return this.orgService.addHistory(event.orgId, {
      owner: event.addedBy,
      action: OrgHistoryAction.ADD_MEMBER,
      member: event.newMemberId,
      date: new Date(),
    });
  }

  @OnEvent(OrgEvents.onMemberRemoved)
  public onMemberRemoved(event: OrgRemoveMemberEvent) {
    return this.orgService.addHistory(event.orgId, {
      owner: event.removedBy,
      action: OrgHistoryAction.REMOVE_MEMBER,
      member: event.removedMemberId,
      date: new Date(),
    });
  }

  @OnEvent(OrgEvents.onDodStatusDeleted)
  public onDodStatusDeleted(event: OrgDodStatusDeletedEvent) {

  }

}
