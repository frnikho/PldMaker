import { UserDomain } from "../user/User";

export class Review {
  comment: string;
  blockingPoint: string;
  domains: {
    domain: UserDomain,
    advancement: string;
  }[];

  constructor(comment: string, blockingPoint: string, domains: { domain: UserDomain; advancement: string }[]) {
    this.comment = comment;
    this.blockingPoint = blockingPoint;
    this.domains = domains;
  }
}
