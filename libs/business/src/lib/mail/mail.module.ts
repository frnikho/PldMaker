import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./mail.service";
import { MailHelper } from "./mail.helper";
import * as path from "path";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"PLD [Maker]" <noreply@pld.nikho.dev>',
      },
      preview: process.env.PREVIEW_EMAIL === 'true' ?? false,
      template: {
        dir: path.join(__dirname, 'assets/mails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [MailService, MailHelper],
  exports: [MailService, MailHelper]
})
export class MailModule {

}
