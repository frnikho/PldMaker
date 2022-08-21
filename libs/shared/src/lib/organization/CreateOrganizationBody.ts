import {IsNotEmpty, IsOptional, Length, Max, Min} from "class-validator";

export class CreateOrganizationBody {

  @IsNotEmpty()
  @Length(0, 30)
  public name: string;

  @IsOptional()
  public description?: string;

  @Min(0)
  @Max(2.00)
  public versionShifting: number;

  @IsOptional()
  public invitedMembers: string[];

  constructor(name: string, description: string | undefined, versionShifting: number, invitedMembers: string[]) {
    this.name = name;
    this.versionShifting = versionShifting;
    this.invitedMembers = invitedMembers;
    this.description = description;
  }


}
