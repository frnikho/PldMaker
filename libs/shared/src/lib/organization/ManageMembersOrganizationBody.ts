import {IsNotEmpty} from "class-validator";

export class ManageMembersOrganizationBody {

  @IsNotEmpty()
  public orgId: string;

  @IsNotEmpty()
  public membersId: string[];

  constructor(orgId: string, membersId: string[]) {
    this.orgId = orgId;
    this.membersId = membersId;
  }
}

export class InviteUserOrgBody {

  @IsNotEmpty()
  public orgId: string;

  @IsNotEmpty()
  public memberEmail: string;

  constructor(orgId: string, memberEmail: string) {
    this.orgId = orgId;
    this.memberEmail = memberEmail;
  }

}
