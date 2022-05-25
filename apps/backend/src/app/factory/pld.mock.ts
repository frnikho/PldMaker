import {Pld} from "../pld/pld.schema";
import {User} from "../user/user.schema";
import {Organization} from "../organization/organization.schema";

export type PldMockUserOwner = {
  owner: User;
  name: string;
  description: string;
  version: number;
}

export type PldMockUserOrg = {
  owner: Organization;
  name: string;
  description: string;
  version: number;
}

export class PldMock {

  public static createPldWithUserOwner({owner, name = '', description = '', version = 1.0}: PldMockUserOwner): Pld {
    return {
      name,
      owner,
      description,
      ownerType: 'User',
      version,
    }
  }

  public static createPldWithOrgOwner({owner, name = '', description = '', version = 1.0}: PldMockUserOrg): Pld {
    return {
      name,
      owner,
      description,
      ownerType: 'Organization',
      version,
    }
  }

}
