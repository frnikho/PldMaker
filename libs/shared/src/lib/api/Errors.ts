export enum ApiErrorsCodes {
  DEFAULT,
  INVALID_USER_AUTH_TOKEN,
  UNAUTHORIZED,
  FORBIDDEN,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  INVALID_PASSWORD,
  INVALID_OBJECT_ID,
  OBJECT_ALREADY_EXIST,
  DB_ERROR,
}

export const ApiErrors: { code: ApiErrorsCodes, status: number, message: string } [] = [
  {
    code: ApiErrorsCodes.INVALID_USER_AUTH_TOKEN,
    status: 403,
    message: '',
  }
]

export type ApiError = {
  code: ApiErrorsCodes;
  status: number;
  errors: string[];
  message: string;
}

export const buildException = (key: ApiErrorsCodes, message?: string, errors: string[] = []): ApiError => {
  const error = ApiErrors.find((a) => a.code === key);
  return {
    status: error?.status ?? 400,
    errors: errors,
    message: message ?? error?.message ?? 'An error occurred !',
    code: error?.code ?? ApiErrorsCodes.FORBIDDEN,
  }
}
