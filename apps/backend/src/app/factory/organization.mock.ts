import { Organization } from "../organization/organization.schema";
import { User } from "../user/user.schema";
import { UserMock } from "./user.mock";

export class OrganizationMock {

    public static createOrg({name = 'EIP #1', description = 'Main eip org for epitech student', owner = UserMock.createUser({}), members = []}): Organization {
      return {
          created_date: new Date(),
          updated_date: new Date(),
          description,
          members,
          name,
          owner,
      };
    }

    public static createPopulateOrg({name = '', description = '', owner = UserMock.createUser({email: 'admin@google.com'})}) {
        const members: User[] = [
            UserMock.createUser({email: 'victor@eip.com'}), 
            UserMock.createUser({email: 'baptiste@eip.com'}),
            UserMock.createUser({email: 'theo@eip.com'}),
            UserMock.createUser({email: 'justin@eip.com'}),
            UserMock.createUser({email: 'van@eip.com'}),
            UserMock.createUser({email: 'clement@eip.com'}),
            UserMock.createUser({email: 'luann@eip.com'}),
        ];

        return {
            created_date: new Date(),
            updated_date: new Date(),
            description,
            members,
            name,
            owner,
        }
    }

}