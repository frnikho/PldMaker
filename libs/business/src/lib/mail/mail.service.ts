import { Injectable } from "@nestjs/common";
import { User } from "@pld/shared";
import { AvailableMail } from "./mail.list";
import { MailHelper } from "./mail.helper";

@Injectable()
export class MailService {

  constructor(private mailHelper: MailHelper) {
  }

  public sendMail(user: User, email: AvailableMail) {
    return this.mailHelper.sendEmail(user, email);
  }

}
