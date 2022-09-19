export type LoginToken = {
  access_token: string;
}

export type PayloadLogin = {
  sub: string;
  email: string;
  mfa?: mfa[];
}

type mfa = {
  date: Date;
  secret: string;
}
