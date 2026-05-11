import axios from 'axios';

// Criamos uma instância do axios com o endereço do seu backend
const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;
