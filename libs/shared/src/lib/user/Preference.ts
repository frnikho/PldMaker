export class EmailPreference {
  sendAllEmail: boolean;
  sendNewsEmail: boolean;
  sendLoginEmail: boolean;
  sendAlertEmail: boolean;

  constructor(sendAllEmail: boolean, sendNewsEmail: boolean, sendLoginEmail: boolean, sendAlertEmail: boolean) {
    this.sendAllEmail = sendAllEmail;
    this.sendNewsEmail = sendNewsEmail;
    this.sendLoginEmail = sendLoginEmail;
    this.sendAlertEmail = sendAlertEmail;
  }
}

export class Preference {
  email: EmailPreference;

  constructor(email: EmailPreference) {
    this.email = email;
  }
}


export const defaultPreference: Preference = {
  email: {
    sendAllEmail: true,
    sendAlertEmail: true,
    sendLoginEmail: true,
    sendNewsEmail: true
  }
}

export class UpdatePreference {
  email: Partial<EmailPreference>;

  constructor(email: Partial<EmailPreference>) {
    this.email = email;
  }
}
