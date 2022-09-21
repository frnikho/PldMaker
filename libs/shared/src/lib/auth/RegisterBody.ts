import { IsEmail, IsNotEmpty, Length, MaxLength, MinLength } from "class-validator";

export class RegisterBody {
  @IsEmail({}, {
    message: "l'email doit être au format hello@hello.com"
  })
  public email: string;

  @MinLength(5, {
    message: 'Le mot de passe doit être supérieur a 5 de longueur'
  })
  @MaxLength(64, {
    message: 'Le mot de passe ne poit pas être supérieur a 64 de longeur',
  })
  public password: string;

  @IsNotEmpty({message: 'le prénom ne peut pas être vide !'})
  @Length(2, 32)
  public firstname: string;

  @IsNotEmpty({message: 'le nom ne peut pas être vide !'})
  @Length(2, 32)
  public lastname: string;


  constructor(email: string, password: string, firstname: string, lastname: string) {
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}
