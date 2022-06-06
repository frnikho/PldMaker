import {IsNotEmpty, Max, Min} from "class-validator";

export class PldOrgCreateBody {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
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


  constructor(title: string, description: string, owner: string, manager: string, tags: string[], promotion: number, version: number) {
    this.title = title;
    this.description = description;
    this.owner = owner;
    this.manager = manager;
    this.tags = tags;
    this.promotion = promotion;
    this.version = version;
  }
}
