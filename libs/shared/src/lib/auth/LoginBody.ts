import {IsEmail, MaxLength, MinLength} from "class-validator";

export class LoginBody {

  @IsEmail({}, {
    message: "l'email doit être au format hello@hello.com"
  })
  email: string;

  @MinLength(5, {
    message: 'Le mot de passe doit être supérieur a 5 de longueur'
  })
  @MaxLength(64, {
    message: 'Le mot de passe ne doit pas être supérieur a 64 de longueur',
  })
  password: string;

  agent: string;
  os: string;
  language?: string;

  constructor(email: string, password: string, agent: string, os: string, language: string) {
    this.email = email;
    this.password = password;
    this.agent = agent;
    this.os = os;
    this.language = language;
  }
}
