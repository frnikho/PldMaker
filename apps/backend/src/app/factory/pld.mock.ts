import {Pld, RevisionUpdate} from "../pld/pld.schema";
import {User} from "../user/user.schema";
import {Organization} from "../organization/organization.schema";
import {PldOwnerType} from "../../../../../libs/data-access/pld/PldOwnerType";
import {PldStatus} from "../../../../../libs/data-access/pld/PldStatus";

export type PldMockUserOwner = {
  owner: User;
  title: string;
  description: string;
  version: number;
  revisionsUpdated?: RevisionUpdate[];
}

export type PldMockUserOrg = {
  owner: Organization;
  title: string;
  description: string;
  version: number;
  manager: User;
  revisionsUpdated?: RevisionUpdate[];
}

export class PldMock {

  public static createPldWithUserOwner({owner, revisionsUpdated = [], title = '', description = '', version = 1.0}: PldMockUserOwner): Pld {
    return {
      title,
      owner,
      description,
      ownerType: PldOwnerType.User,
      version,
      status: PldStatus.edition,
      manager: owner,
      promotion: 2024,
      revisionsUpdated,
    }
  }

  public static createPldWithOrgOwner({owner, manager, revisionsUpdated = [], title = '', description = '', version = 1.0}: PldMockUserOrg): Pld {
    return {
      title,
      owner,
      description,
      ownerType: PldOwnerType.Organization,
      version,
      status: PldStatus.edition,
      manager,
      promotion: 2024,
      revisionsUpdated: revisionsUpdated
    }
  }

}
