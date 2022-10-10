import { ArrayMinSize, IsNotEmpty, Length, MaxLength, Min } from "class-validator";

export class PldOrgFindsBody {
  organizations: string[];

  constructor(organizations: string[]) {
    this.organizations = organizations;
  }
}

export class PldOrgCreateBody {
  @IsNotEmpty({message: 'le titre ne peux pas être vide !'})
  @Length(5, 64, {message: 'le titre doit contenir au minimum 5 caractères et au maximum 64 caractères'})
  title: string;

  @MaxLength(512, {message: 'la description ne doit pas dépasser 512 caractères'})
  description: string;

  @IsNotEmpty()
  @Length(24, 24)
  owner: string;

  @IsNotEmpty({message: 'le manager ne peux pas être vide !'})
  manager: string;

  @ArrayMinSize(1, {message: 'le pld doit contenir au minimum 1 tag'})
  tags: string[];

  @IsNotEmpty({message: 'la date de promotion ne doit pas être vide'})
  @Min(1900, {message: 'la date de promotion ne peux pas être antérieur à 1900'})
  promotion: number;

  @IsNotEmpty()
  @Min(0, {message: 'la version doit être négative'})
  version: number;

  @IsNotEmpty({message: 'la date de début du sprint doit être renseigner'})
  startingDate: Date;

  @IsNotEmpty({message: 'la date de fin du sprint doit être renseigner'})
  endingDate: Date;

  @ArrayMinSize(1, {message: 'vous devez avoir au moins 1 étape !'})
  steps: string[];

  constructor(title: string, description: string, owner: string, manager: string, tags: string[], promotion: number, version: number, startingDate: Date, endingDate: Date, steps: string[]) {
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.manager = manager;
    this.tags = tags;
    this.promotion = promotion;
    this.version = version;
    this.startingDate = startingDate;
    this.endingDate = endingDate;
    this.steps = steps;
  }
}
