import {NavigationState} from "./Navigation";

export type PageState = {
  loading: boolean;
} & NavigationState;
