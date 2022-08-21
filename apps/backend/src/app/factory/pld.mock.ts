import {Pld, RevisionUpdate} from "../pld/pld.schema";
import {User} from "../user/user.schema";
import {Organization} from "../organization/organization.schema";
import {PldOwnerType} from "@pld/shared";
import {PldStatus} from "@pld/shared";

export type PldMockUserOwner = {
  owner: User;
  title: string;
  description: string;
  version: number;
  revisions?: RevisionUpdate[];
}

export type PldMockUserOrg = {
  owner?: Organization;
  title?: string;
  description?: string;
  version?: number;
  manager?: User;
  revisions?: RevisionUpdate[];
}

export class PldMock {

  public static createPldWithUserOwner({owner, revisions = [], title = '', description = '', version = 1.0}: PldMockUserOwner): Pld {
    return {
      title,
      owner,
      description,
      ownerType: PldOwnerType.User,
      version,
      status: PldStatus.edition,
      manager: owner,
      promotion: 2024,
      revisions,
      steps: [],
      startingDate: new Date(),
      endingDate: new Date(),
      history: [],
    }
  }

  public static createPldWithOrgOwner({owner, manager, revisions = [], title = 'Hello World', description = 'Abc', version = 1.0}: PldMockUserOrg): Pld {
    return {
      title,
      owner,
      description,
      ownerType: PldOwnerType.Organization,
      version,
      status: PldStatus.edition,
      manager,
      promotion: 2024,
      revisions,
      steps: [],
      startingDate: new Date(),
      endingDate: new Date(),
      history: [],
    }
  }

}
