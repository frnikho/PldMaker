import { User } from "../user/user.schema";

export class UserMock {

    public static createUser({email = 'nicolas.sansd@gmail.com', password = '358227', roles = ['user']}): User {
      return {
          created_date: new Date(),
          updated_date: new Date(),
          email,
          password,
          roles
      };
    }

    public static createUsers(): User[] {
        return [];
    }

}