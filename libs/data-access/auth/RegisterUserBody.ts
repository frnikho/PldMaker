import {IsEmail, IsNotEmpty, Length} from "class-validator";

export class RegisterUserBody {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @Length(5, 32)
  public password: string ;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
