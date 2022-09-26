import { Injectable, Logger } from "@nestjs/common";
import { DodService } from "./dod.service";
import { OnEvent } from "@nestjs/event-emitter";
import { DodEvents, DodStatusDeletedEvent, DodStatusUpdatedEvent, DodUpdateEvent } from "./dod.event";
import { DodHistoryAction } from "@pld/shared";

@Injectable()
export class DodListener {

  constructor(private dodService: DodService) {}

  @OnEvent(DodEvents.onDodUpdate)
  public onDodUpdated(event: DodUpdateEvent) {
    this.dodService.addHistory(event.editedBy, {
      editedFields: event.editedFields,
      dodId: event.editedDod,
      owner: event.editedBy,
      action: DodHistoryAction.DodUpdated,
    }).then(() => {
      Logger.log(`Dod Updated: ${event.editedDod} (${event.editedBy})`, DodEvents.onDodUpdate);
    });
  }

  @OnEvent(DodEvents.onDodStatusUpdated)
  public onDodStatusUpdated(event: DodStatusUpdatedEvent) {
    this.dodService.addHistory(event.updatedBy._id.toString(), {
      dodId: event.editedDod._id.toString(),
      editedFields: [{name: 'status', value: event.editedDod.status.name, lastValue: event.beforeUpdatedDod.status.name}],
      action: DodHistoryAction.DodStatusUpdated,
      owner: event.editedDod.owner._id,
    }).then(() => {
      Logger.log(`Status of dod Updated: ${event.editedDod._id} (${event.updatedBy.email})`);
    })
  }

  @OnEvent(DodEvents.onDodStatusDeleted)
  public onDodStatusDeleted(event: DodStatusDeletedEvent) {
    return this.dodService.migrateAllDodStatus(event.removedBy, event.orgId, event.dodStatusId);
  }

}
