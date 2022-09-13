import {IsNotEmpty} from "class-validator";

export class ManageMembersOrganizationBody {

  @IsNotEmpty()
  public userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}

export class InviteUserOrgBody {

  @IsNotEmpty()
  public memberEmail: string;

  constructor(memberEmail: string) {
    this.memberEmail = memberEmail;
  }

}

export class RemoveUserOrgBody {
  public memberId: string;

  constructor(memberId: string) {
    this.memberId = memberId;
  }
}
