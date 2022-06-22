import axios from 'axios';

export const API_VERSION = process.env['NX_FRONT_API_VERSION'];
export const SERVER_HOST = process.env['NX_SERVER_HOST'];
export const LANGUAGE = 'fr';

export default axios.create({
    baseURL: `${SERVER_HOST}v${API_VERSION}/`,
    headers: {
        'App-Language': LANGUAGE
    }

});

export const authorize = (accessToken: string) => {
    return {
        headers: {Authorization: `Bearer ${accessToken}`}
    };
}

export const getHeaders = () => {
  return '';
};

export type ApiError = {
  statusCode: number;
  message: string | string[];
  error: string;
  type: ErrorType.API_ERROR,
} | Error

export type Error = {
  error?: string,
  type: ErrorType,
  message: string[],
  statusCode?: 400,
}

export enum ErrorType {
  API_ERROR = '',
  NO_USER_FOUND_EMAIL = 'NO_USER_FOUND_EMAIL',
}
