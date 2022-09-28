export enum AlertPosition {
  'ALL' = 'All',
  'HOME'= 'HomePage',
  'USER' = 'UserPage',
  'ORGANIZATION' = 'OrganizationPage',
  'PLD' = 'PldPage',
}

export enum AlertActionType {
  OPEN_URL= 'OpenUrl',
  MOVE_PAGE = 'MovePage',
}

export enum AlertActionTrigger {
  ALERT_SEEN = 'AlertSeen',
  DISMISS_ALERT = 'AlertDismissed',
  VALID_ALERT = 'AlertValidated',
}

export enum AlertTargetType {
  ALL_USERS = 'AllUsers',
  ONLY_USERS = 'OnlyUsers',
  USER_NOT_IN_ORG = 'UserNotInOrg',
  MFA_NOT_ENABLED = 'MfaNotEnabled',

}

export class AlertTarget {
  sendNotification: boolean;
  type: AlertTargetType;
  data: string | string[];

  constructor(sendNotification: boolean, type: AlertTargetType, data: string | string[]) {
    this.sendNotification = sendNotification;
    this.type = type;
    this.data = data;
  }
}

export class AlertAction {
  data: string;
  type: AlertActionType;
  trigger: AlertActionTrigger[];

  constructor(data: string, type: AlertActionType, trigger: AlertActionTrigger[]) {
    this.data = data;
    this.type = type;
    this.trigger = trigger;
  }
}
