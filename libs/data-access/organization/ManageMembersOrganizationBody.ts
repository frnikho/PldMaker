import {IsNotEmpty} from "class-validator";

export class ManageMembersOrganizationBody {

  @IsNotEmpty()
  public orgId: string;

  @IsNotEmpty()
  public membersId: string[];

}
