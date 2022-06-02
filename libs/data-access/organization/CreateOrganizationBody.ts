import {IsNotEmpty, IsOptional, Length, Max, Min} from "class-validator";

export class CreateOrganizationBody {

  @IsNotEmpty()
  @Length(0, 30)
  public name: string;

  @IsOptional()
  public description?: string;

  @Min(0.01)
  @Max(1.00)
  public versionShifting: number;

}
