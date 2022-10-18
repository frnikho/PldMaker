import { ArrayMinSize, ArrayNotContains, IsNotEmpty, IsOptional, Length, Matches, MaxLength } from "class-validator";
import { IsValidWorkTimeArray } from "../validator/WorkTimeValidator";

export class DodFindPldBody {
  plds: string[];

  constructor(plds: string[]) {
    this.plds = plds;
  }
}

export class DodCreateBody {
  @IsNotEmpty({message: 'La version ne peut pas être vide !'})
  @Length(2,64)
  @Matches(new RegExp('[0-9]+\\..*\\.[0-9]+'), {message: 'Format invalide !'})
  version: string;

  @IsNotEmpty({message: 'Le titre ne peut pas être vide !'})
  @Length(2,64, {message: 'le champ doit contenir au minimum 2 caractères et maximum 64 caractères'})
  title: string;

  @IsNotEmpty({message: 'Cette section ne peut pas être vide !'})
  @Length(2,64, {message: 'le champ doit contenir au minimum 2 caractères et maximum 64 caractères'})
  skinOf: string;

  @IsNotEmpty({message: 'Cette section ne peut pas être vide !'})
  @Length(2,64, {message: 'le champ doit contenir au minimum 2 caractères et maximum 64 caractères'})
  want: string;

  @IsNotEmpty({message: 'La description ne peut pas être vide !'})
  @MaxLength(512, {message: 'la description ne peux pas dépasser 512 caractères !'})
  description: string;

  @IsNotEmpty({message: "le PLD owner ne peut pas être vide !"})
  pldOwner: string;

  @IsNotEmpty({message: "l'owner ne peut pas être vide !"})
  owner: string;

  @ArrayMinSize(1)
  @ArrayNotContains([''], {message: 'Données non valide, vous devez rentrer au minimum une définition'})
  descriptionOfDone: string[];

  @ArrayMinSize(1)
  @IsValidWorkTimeArray({message: 'Données non valide, vous devez rentrer au minimum une charges avec un utilisateur'})
  estimatedWorkTime: UserWorkTime[];

  constructor(version: string, title: string, skinOf: string, want: string, description: string, pldOwner: string, owner: string, descriptionOfDone: string[], estimatedWorkTime: UserWorkTime[]) {
    this.version = version;
    this.title = title;
    this.skinOf = skinOf;
    this.want = want;
    this.description = description;
    this.pldOwner = pldOwner;
    this.owner = owner;
    this.descriptionOfDone = descriptionOfDone;
    this.estimatedWorkTime = estimatedWorkTime;
  }
}

type UserWorkTime = {
  users: string[];
  value: number;
  format: string,
}

export enum WorkTimeFormat {
  JOUR_HOMME = 'J/H',
  HOURS = 'Heures',
}

export class DodUpdateBody {
  @IsOptional()
  @IsNotEmpty({message: 'La version ne peut pas être vide !'})
  @Length(2,64)
  @Matches(new RegExp('[0-9]+\\..*\\.[0-9]+'), {message: 'Format invalide !'})
  version?: string;

  @IsNotEmpty({message: 'Le titre ne peut pas être vide !'})
  @Length(2,64, {message: 'le champ doit contenir au minimum 2 caractères et maximum 64 caractères'})
  title?: string;
  skinOf?: string;
  want?: string;
  description?: string;
  pldOwner?: string;
  owner?: string;
  descriptionOfDone?: string[];
  estimatedWorkTime?: UserWorkTime[];

  constructor(version: string, title: string, skinOf: string, want: string, description: string, pldOwner: string, owner: string, descriptionOfDone: string[], estimatedWorkTime: UserWorkTime[]) {
    this.version = version;
    this.title = title;
    this.skinOf = skinOf;
    this.want = want;
    this.description = description;
    this.pldOwner = pldOwner;
    this.owner = owner;
    this.descriptionOfDone = descriptionOfDone;
    this.estimatedWorkTime = estimatedWorkTime;
  }
}
