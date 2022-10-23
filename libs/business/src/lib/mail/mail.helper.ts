import { Injectable, Logger } from "@nestjs/common";
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

  public async sendChangePasswordMail(user: User, token: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Changer votre mot de passe',
      template: AvailableMail.ChangePassword,
      context: {
        email: user.email,
        link: `${process.env.NX_CLIENT_HOST}/profile/password?token=${token}&email=${user.email}`,
      }
    }).then((info) => {
      Logger.log(info);
    }).catch((err) => {
      Logger.error(err);
    })
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
