import { AppError } from '@utils/AppError';
import axios from 'axios'

 const api = axios.create({
    baseURL: 'http://192.168.15.5:3333',
})

//intercepta as requisições feita na aplicação
api.interceptors.response.use((response) => response, (error) => {
    if(error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message));
    } else {
        return Promise.reject(error)
    }
})

export { api };
