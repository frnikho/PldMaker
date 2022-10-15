import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Organization, User } from "@pld/shared";
import { AvailableMail } from "./mail.list";

@Injectable()
export class MailHelper {

  constructor(private mailerService: MailerService) {

  }

  private getUserEmailPreferenceUrl = ''

  public async sendWelcomeMail(user: User, email: AvailableMail) {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: '👋 Bienvenue sur PLD [Maker]',
        template: email,
        context: {
          lastname: user.lastname,
          firstname: user.firstname,
        },
      })
      .then((info) => console.log(info))
      .catch((err) => console.log(err));
  }

  public async sendInvitationOrg(user: User, org: Organization, invitedByUser: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: `Vous avez reçu une invitation a rejoindre l'organisation '${org.name}'`,
      template: AvailableMail.OrgInvitation,
      context: {
        org_name: org.name,
      }
    })
      .then((info) => console.log(info))
      .catch((err) => console.log(err));
  }

}
