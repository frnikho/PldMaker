import {Injectable, Logger} from "@nestjs/common";
import {PldService} from "./pld.service";
import {OnEvent} from "@nestjs/event-emitter";
import {
  PldDodCreatedEvent,
  PldDodDeletedEvent,
  PldEvents,
  PldRevisionAddedEvent,
  PldSignedEvent, PldStatusUpdatedEvent,
  PldUpdatedEvent
} from "./pld.event";
import {PldHistoryAction} from "@pld/shared";

@Injectable()
export class PldListener {

  constructor(private pldService: PldService) {
  }

  @OnEvent(PldEvents.onPldUpdate)
  public onPldUpdate(event: PldUpdatedEvent) {
    this.pldService.addHistory(event.updatedBy, {
      editedFields: event.editedFields,
      pldId: event.editedPld,
      action: PldHistoryAction.PldUpdated,
    }).then(() => {
      Logger.log(``, PldHistoryAction.PldUpdated);
    });
  }

  @OnEvent(PldEvents.onDodCreated)
  public onDodCreated(event: PldDodCreatedEvent) {
    this.pldService.addHistory(event.updatedBy, {
      editedFields: [],
      dod: event.dodId,
      pldId: event.editedPld,
      action: PldHistoryAction.DodCreated,
    }).then(() => {
      Logger.log(``, PldHistoryAction.DodCreated);
    });
  }

  @OnEvent(PldEvents.onDodDeleted)
  public onDodDeleted(event: PldDodDeletedEvent) {
    this.pldService.addHistory(event.updatedBy, {
      editedFields: [],
      dod: event.dodId,
      pldId: event.editedPld,
      action: PldHistoryAction.DodDeleted,
    }).then(() => {
      Logger.log(``, PldHistoryAction.DodDeleted);
    });
  }

  @OnEvent(PldEvents.onPldRevisionAdded)
  public onPldRevisionAdded(event: PldRevisionAddedEvent) {
    this.pldService.addHistory(event.updatedBy, {
      editedFields: [],
      revision: event.revision,
      pldId: event.editedPld,
      action: PldHistoryAction.PldRevisionAdded,
    }).then(() => {
      Logger.log(``, PldHistoryAction.PldRevisionAdded);
    });
  }

  @OnEvent(PldEvents.onPldSigned)
  public onPldSigned(event: PldSignedEvent) {
    this.pldService.addHistory(event.updatedBy, {
      editedFields: event.editedFields,
      pldId: event.editedPld,
      action: PldHistoryAction.PldSigned,
    }).then(() => {
      Logger.log(``, PldHistoryAction.PldSigned);
    });
  }

  @OnEvent(PldEvents.onPldStatusUpdated)
  public onPldStatusUpdated(event: PldStatusUpdatedEvent) {
    this.pldService.addHistory(event.updatedBy, {
      editedFields: event.editedFields,
      pldId: event.editedPld,
      action: PldHistoryAction.PldStatusUpdated,
    }).then(() => {
      Logger.log(``, PldHistoryAction.PldStatusUpdated);
    });
  }

  @OnEvent(PldEvents.onPldDataImported)
  public onPldDataImported() {
    //
  }

}
