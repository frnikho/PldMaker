import axios from 'axios';

export const API_VERSION = process.env['FRONT_API_VERSION'];
export const SERVER_HOST = process.env['SERVER_HOST'];
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
