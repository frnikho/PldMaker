import {IsNumberString, Length} from "class-validator";

export class Mobile {
  @Length(1, 3)
  @IsNumberString()
  indicatif: string;

  @Length(4, 13)
  @IsNumberString()
  mobile: string;

  constructor(indicatif: string, mobile: string) {
    this.indicatif = indicatif;
    this.mobile = mobile;
  }
}
