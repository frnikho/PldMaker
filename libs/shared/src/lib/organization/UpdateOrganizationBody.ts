import { IsNotEmpty, IsOptional, Length, Max, MaxLength, Min } from "class-validator";

export class UpdateOrganizationBody {
  @IsNotEmpty()
  orgId: string;

  @IsOptional()
  @Length(5, 64, {message: 'Le titre doit contenir au minimum 2 caractères et maximum 64'})
  name?: string;

  @IsOptional()
  @MaxLength(64, {message: 'La description doit contenir au maximum 512 caractères'})
  description?: string;

  @IsOptional()
  @Min(0.01)
  @Max(2)
  versionShifting?: number;

  constructor(orgId: string, name: string, description: string, versionShifting: number) {
    this.orgId = orgId;
    this.name = name;
    this.description = description;
    this.versionShifting = versionShifting;
  }
}
