import {UserDomain} from "@pld/shared";
import { Timezone } from "@pld/utils";
import { User } from "@pld/business";

export class UserMock {

    public static createUser({email = 'nicolas.sansd@gmail.com', password = '358227', roles = ['user'], domain = [UserDomain.MOBILE]}): User {
      return {
        created_date: new Date(),
        updated_date: new Date(),
        email,
        password,
        roles,
        domain,
        devices: [],
        mfa: [],
        profile_picture: 'default_profile_picture.png',
        timezone: Timezone.CET,
        firstname: 'abc',
        lastname: 'def',
      };
    }

    public static createUsers(): User[] {
        return [];
    }

}
