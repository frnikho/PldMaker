import React from "react";
import { Dod, DodStatus, Organization, OrganizationSection, Pld } from "@pld/shared";

type ValueOf<T> = T[keyof T];


type PldStateType = {
  pld?: Pld;
  org?: Organization;
  status: DodStatus[];
  sections: OrganizationSection[];
  dod?: Dod[];
}

type Error = {

}

export const usePld = (accessToken: string) => {
  const [state, setState] = React.useState<PldStateType>({
    org: undefined,
    dod: [],
    pld: undefined,
    sections: [],
    status: [],
  });

  const watch = <T extends keyof PldStateType>(key?: T): PldStateType[T] | PldStateType => {
    if (key === undefined)
      return state as PldStateType;
    return state[key];
  }

  return(
    {
      watch
    });
};
