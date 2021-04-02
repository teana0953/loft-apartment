import Axios from 'axios';

let developmentUrl = `http://localhost:50000/api/v1`;

let productionUrl = 'https://pwa-demo0311.herokuapp.com';

export const baseUrl = process.env.NODE_ENV === 'production' ? productionUrl : developmentUrl;
export const Server = Axios.create({
    baseURL: baseUrl,
    responseType: 'json'
});
