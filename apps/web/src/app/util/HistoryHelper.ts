import {User, Dod, DodHistoryAction, OrgHistoryAction, PldHistoryAction} from "@pld/shared";

export class HistoryHelper {

  public static replacePlaceholder(action: PldHistoryAction | OrgHistoryAction | DodHistoryAction, owner: User, dod?: Dod): string {
    return HistoryHelper.getHistoryMessageWithAction(action)
      .replace('%user.firstname%', owner.firstname ?? '')
      .replace('%user.lastname%', owner.lastname?.toUpperCase() ?? '')
      .replace('%user.email%', owner.email)
      .replace('%dod.version%', dod?.version ?? '')
      .replace('%dod.name%', dod?.title ?? '')
      //.replace('%dod.status%', dod?.status.name ?? '')
  }

  public static getHistoryMessageWithAction = (action: PldHistoryAction | OrgHistoryAction | DodHistoryAction): string => {
    if (Object.values(DodHistoryAction).includes(action as DodHistoryAction)) {
      return this.getDodHelperMessage(action as DodHistoryAction);
    } else if (Object.values(PldHistoryAction).includes(action as PldHistoryAction)) {
      return this.getPldHelperMessage(action as PldHistoryAction);
    } else if (Object.values(OrgHistoryAction).includes(action as OrgHistoryAction)) {
      return this.getPldHelperMessage(action as PldHistoryAction);
    }
    return 'Aucun donnée valable pour cet historique'
  }

/*  private static getOrgHelperMessage = (action: OrgHistoryAction) => {
    return 'ORG'
  }*/

  private static getPldHelperMessage = (action: PldHistoryAction): string => {
    const actions = {
      [PldHistoryAction.PldDataImported]: '%user.lastname% %user.firstname% a importer x données !',
      [PldHistoryAction.DodDeleted]: '%user.lastname% %user.firstname% a supprimé une DoD: %dod.version% - %dod.name%',
      [PldHistoryAction.DodCreated]: '%user.lastname% %user.firstname% a créer une DoD: %dod.version% - %dod.name%',
      [PldHistoryAction.PldStatusUpdated]: '%user.lastname% %user.firstname% a changé le status du PLD',
      [PldHistoryAction.PldRevisionAdded]: '%user.lastname% %user.firstname% a ajouté une révision',
      [PldHistoryAction.PldSigned]: '%user.lastname% %user.firstname% a signé le PLD',
      [PldHistoryAction.PldStatusUpdated]: '%user.lastname% %user.firstname% a mis à jour le status du PLD',
      [PldHistoryAction.PldUpdated]: '%user.lastname% %user.firstname% a mis à jour le PLD',
    }
    return actions[action] ?? 'Aucune donnée valable pour cet historique';
  }

  private static getDodHelperMessage = (action: DodHistoryAction): string => {
    const actions = {
      [DodHistoryAction.DodUpdated]: '%user.lastname% %user.firstname% a mis à jour la DoD %dod.version% - %dod.name%',
      [DodHistoryAction.DodStatusUpdated]: '%user.lastname% %user.firstname% a changé le statut de la DoD %dod.version% - %dod.name%'
    }
    return actions[action] ?? 'Aucune donnée valable pour cet historique';
  }

}

