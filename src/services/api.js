import axios from 'axios';
import { getItem } from '../utils/storage'

const token = getItem('token');
export default axios.create({
    baseURL: 'https://desafio-backend-03-dindin.herokuapp.com',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
});