import axios from 'axios';

const api = axios.create({
  // Aqui é o endereço do seu backend que testamos no Postman
  baseURL: 'http://localhost:3333' 
});

export default api;
