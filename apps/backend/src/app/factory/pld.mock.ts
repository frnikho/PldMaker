import {PldStatus} from "@pld/shared";
import { Organization, Pld, RevisionUpdate, User } from "@pld/business";


export type PldMockUserOrg = {
  owner: User;
  org: Organization;
  title?: string;
  description?: string;
  version?: number;
  manager?: User;
  revisions?: RevisionUpdate[];
}

export class PldMock {

  public static createPld({owner, org, manager, revisions = [], title = 'Hello World', description = 'Abc', version = 1.0}: PldMockUserOrg): Pld {
    return {
      title,
      owner,
      org,
      description,
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
