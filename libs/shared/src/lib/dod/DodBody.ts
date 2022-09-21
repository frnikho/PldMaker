import { ArrayMinSize, ArrayNotContains, IsNotEmpty, Length, MaxLength } from "class-validator";

export class DodFindPldBody {
  plds: string[];


  constructor(plds: string[]) {
    this.plds = plds;
  }
}

export class DodCreateBody {
  @IsNotEmpty({message: 'La version ne peut pas être vide !'})
  /*@Matches(new RegExp('[0-9]+\\..*\\.[0-9]+'), {message: 'Format invalide !'})*/
  version: string;

  @IsNotEmpty({message: 'Le titre ne peut pas être vide !'})
  @Length(2,64)
  title: string;

  @IsNotEmpty({message: 'Cette section ne peut pas être vide !'})
  @Length(2,64)
  skinOf: string;

  @IsNotEmpty({message: 'Cette section ne peut pas être vide !'})
  @Length(2,64)
  want: string;

  @IsNotEmpty({message: 'La description ne peut pas être vide !'})
  @MaxLength(512)
  description: string;

  @IsNotEmpty({message: "le PLD owner ne peut pas être vide !"})
  pldOwner: string;

  @IsNotEmpty({message: "l'owner ne peut pas être vide !"})
  owner: string;

  @ArrayMinSize(1)
  @ArrayNotContains([''], {message: 'Mauvais format de Description of Done'})
  descriptionOfDone: string[];

  @ArrayMinSize(1)
  @ArrayNotContains([{value: 0}, {users: ''}, {users: ''}, {value: 0}])
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
  version?: string;
  title?: string;
  skinOf?: string;
  want?: string;
  description?: string;
  pldOwner?: string;
  owner?: string;
  descriptionOfDone?: string[];
  estimatedWorkTime?: UserWorkTime[];
  status?: string;

  constructor(version: string, title: string, skinOf: string, want: string, description: string, pldOwner: string, owner: string, descriptionOfDone: string[], estimatedWorkTime: UserWorkTime[], status: string) {
    this.version = version;
    this.title = title;
    this.skinOf = skinOf;
    this.want = want;
    this.description = description;
    this.pldOwner = pldOwner;
    this.owner = owner;
    this.descriptionOfDone = descriptionOfDone;
    this.estimatedWorkTime = estimatedWorkTime;
    this.status = status;
  }
}
