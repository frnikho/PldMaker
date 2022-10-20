import { IsNotEmpty, IsOptional, Length, Max, MaxLength, Min } from "class-validator";
import { IsObjectID } from "../validator/ObjectIdValidator";

export class PldUpdateBody {

  @IsObjectID()
  pldId: string;

  @IsOptional()
  @IsNotEmpty({message: 'Le titre du PLD ne peux pas être vide !'})
  @Length(2, 128, {message: 'Le titre du PLD doit contenir au minimum 2 caractères et au maximum 128'})
  title?: string;

  @IsOptional()
  @MaxLength(512, {message: 'la description ne peux pas dépasser 512 caractères'})
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsObjectID()
  manager?: string;

  @IsOptional()
  @IsNotEmpty()
  @Min(1900)
  @Max(2900)
  promotion?: number;

  @IsOptional()
  @IsNotEmpty({message: 'l\'étape actuel du PLD ne peux pas être vide !'})
  currentStep?: string;
  tags?: string[];

  constructor(pldId: string, title?: string, description?: string, manager?: string, promotion?: number, currentStep?: string, tags?: string[]) {
    this.pldId = pldId;
    this.title = title;
    this.description = description;
    this.manager = manager;
    this.promotion = promotion;
    this.currentStep = currentStep;
    this.tags = tags;
  }
}
