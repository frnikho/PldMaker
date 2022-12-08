import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { CalendarEvent, Organization, User } from "@pld/shared";
import { AvailableMail } from "./mail.list";
import { formatLongDate } from "@pld/utils";
import * as process from "process";

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

  public async sendMeetupInvitation(user: User, orgId: string, calendarId: string, event: CalendarEvent) {
    this.mailerService.sendMail({
      to: user.email,
      subject: `Invitation à la réunion ${event.title}`,
      template: AvailableMail.MeetupInvitation,
      context: {
        firstname: user.firstname,
        meetup_name: event.title,
        meetup_date: formatLongDate(new Date(event.deadline.startDate)),
        meetup_link: process.env.NX_CLIENT_HOST + `/organization/${orgId}/calendar/${calendarId}/event/${event._id.toString()}`,
      }
    }).then((info) => console.log(info))
      .catch((err) => console.log(err));
  }

}
