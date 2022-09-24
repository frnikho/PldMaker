import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { User } from "@pld/shared";
import { AvailableMail } from "./mail.list";

@Injectable()
export class MailHelper {

  constructor(private mailerService: MailerService) {

  }

  public async sendEmail(user: User, email: AvailableMail) {
    console.log(__dirname + 'assets/mail/' + email);
    this.mailerService
      .sendMail({
        to: user.email,
        subject: '👋 Bienvenue sur PLD [Maker]',
        template: email, // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          lastname: user.lastname,
          firstname: user.firstname,
        },
      })
      .then((info) => {console.log(info)})
      .catch((err) => {console.log(err)});
  }

}
