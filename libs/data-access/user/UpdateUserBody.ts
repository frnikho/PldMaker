export class UpdateUserBody {
  firstname: string;
  lastname: string;
  domain: string[];

  constructor(firstname: string, lastname: string, domain: string[]) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.domain = domain;
  }
}
