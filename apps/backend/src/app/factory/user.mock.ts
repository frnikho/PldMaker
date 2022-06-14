import {User} from "../user/user.schema";
import {UserDomain} from "../../../../../libs/data-access/user/User";

export class UserMock {

    public static createUser({email = 'nicolas.sansd@gmail.com', password = '358227', roles = ['user'], domain = [UserDomain.MOBILE]}): User {
      return {
        created_date: new Date(),
        updated_date: new Date(),
        email,
        password,
        roles,
        domain,
      };
    }

    public static createUsers(): User[] {
        return [];
    }

}
