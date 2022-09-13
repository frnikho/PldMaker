import {Injectable, Logger} from "@nestjs/common";
import {DodService} from "./dod.service";
import {OnEvent} from "@nestjs/event-emitter";
import {DodEvents, DodUpdateEvent} from "./dod.event";
import {DodHistoryAction} from "@pld/shared";

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

}
