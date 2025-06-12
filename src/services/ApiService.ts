import axios from 'axios';
import { Storage } from '@ionic/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', //URL del backend
  withCredentials: false, //Poner true si se necesitan cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor (intercepta y modifica solicitudes o respuestas HTTP antes de que lleguen al servidor o al código) para añadir el token a las solicitudes
api.interceptors.request.use(async (config) => {
 
    const storage = new Storage();
    await storage.create(); // Asegura que storage esté inicializado
    const token = await storage.get('auth_token');
 //Añade el token de autenticación a los headers antes de enviar la solicitud.
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
  return Promise.reject(error);
});

//Interceptor de respuesta para manejar errores 401 (No autorizado)
api.interceptors.response.use(response => response, async error => {
    if (error.response && error.response.status === 401) {
        // Token inválido o expirado se elimina
        const storage = new Storage();
        await storage.create();
        await storage.remove('auth_token');
        console.error('Interceptor: Error 401 - No Autorizado. Token podría ser inválido/expirado.');
    }
    return Promise.reject(error);
});

export default api;