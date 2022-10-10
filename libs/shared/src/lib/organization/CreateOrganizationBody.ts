import { IsNotEmpty, IsOptional, Length, Max, MaxLength, Min } from "class-validator";

export class CreateOrganizationBody {

  @IsNotEmpty({message: 'le nom ne doit pas être vide !'})
  @Length(5, 32, {message: 'le nom doit contenir au minimum 5 caractères et 64 au maximum'})
  public name: string;

  @IsOptional()
  @MaxLength(512, {message: 'la description ne peut pas dépasser 512 caractères'})
  public description?: string;

  @Min(0,  {message: 'minimum 0.01'})
  @Max(2.00, {message: 'maximum 2.00'})
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
