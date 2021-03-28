import Axios from 'axios';

let developmentUrl = `http://172.22.28.204:5000`;

let productionUrl = 'https://pwa-demo0311.herokuapp.com';

let baseUrl = process.env.NODE_ENV === 'production' ? productionUrl : developmentUrl;
export const Server = Axios.create({
    baseURL: baseUrl,
    responseType: 'json'
});
