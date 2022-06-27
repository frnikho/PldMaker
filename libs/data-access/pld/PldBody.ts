import {IsNotEmpty, Length, Min} from "class-validator";

export class PldOrgFindsBody {
  organizations: string[];

  constructor(organizations: string[]) {
    this.organizations = organizations;
  }
}

export class PldOrgCreateBody {
  @IsNotEmpty()
  @Length(5, 64)
  title: string;

  description: string;

  @IsNotEmpty()
  @Length(24, 24)
  owner: string;

  @IsNotEmpty()
  manager: string;

  @IsNotEmpty()
  tags: string[];

  @IsNotEmpty()
  promotion: number;

  @IsNotEmpty()
  @Min(0)
  version: number;

  @IsNotEmpty()
  startingDate: Date;

  @IsNotEmpty()
  endingDate: Date;

  @IsNotEmpty()
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
