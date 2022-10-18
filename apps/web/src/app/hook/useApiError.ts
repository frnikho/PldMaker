import { NestedLanguageKeyOf, useLanguage } from "./useLanguage";
import { ApiErrorsCodes } from "@pld/shared";
import { LanguageType } from "../language";

export const translateCodePath: {code: ApiErrorsCodes, path: NestedLanguageKeyOf<LanguageType> | string}[] = [
  {
    code: ApiErrorsCodes.DEFAULT,
    path: 'errors.api.default'
  },
  {
    code: ApiErrorsCodes.FORBIDDEN,
    path: 'errors.api.forbidden'
  },
  {
    code: ApiErrorsCodes.INVALID_OBJECT_ID,
    path: 'errors.api.invalidObject'
  }
];

export function useApiError() {

  const {translate} = useLanguage();

  const getError = (error: ApiErrorsCodes): string => {
    const a = translateCodePath.find((b) => b.code === error) ?? translateCodePath[0];
    return translate(a.path as NestedLanguageKeyOf<LanguageType>);
  }

  return {
    getError: (error: ApiErrorsCodes) => getError(error),
  }
}
