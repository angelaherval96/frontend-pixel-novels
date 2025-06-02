import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';
import api from '@/services/ApiService'; // Instancia de Axios configurada
import { IUser } from '@/interfaces/IUser';
import { IAuthState } from '@/interfaces/IAuthState';

//Se define el store de autenticación usando Pinia
export const useAuthStore = defineStore('auth', {
  //Estado inicial del store, con usuario, token y si está autenticado o no
  state: (): IAuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),
  //Getters para acceder al usuario, token y estado de autenticación actual guardado en el estado
  getters: {
    currentUser: (state) => state.user,
    currentToken: (state) => state.token,
    isUserAuthenticated: (state) => state.isAuthenticated,
  },
  actions: {
    //Acción para inicializar el store y cargar el token guardado
    async init() {
      const storage = new Storage();
      //Espera hasta que el storage este creado
      await storage.create();
      //Busca si ya hay un token con la clave 'auth_token' y si el usuario ya había iniciado sesión antes y no cerró sesión, se recupera el token
      const storedToken = await storage.get('auth_token');
      if (storedToken) {
        this.token = storedToken;
        this.isAuthenticated = true;
        // Opcional: Intenta obtener los datos del usuario si hay un token
        // await this.fetchUser();
      }
    },
    //Acción para hacer login, recibe credenciales y llama al backend
    async login(credentials: { email: string, password: string }) {
      try {
        const response = await api.post('/login', credentials);
        //Si el login es correcto y hay token, se guardan el usuario y el token en el estado y en el storage.
        if (response.data.success && response.data.data.token) {
          const { user, token } = response.data.data;
          this.user = user;
          this.token = token;
          this.isAuthenticated = true;

          const storage = new Storage();
          await storage.create();
          await storage.set('auth_token', token);
          return true;
        }
        //Si no, lanza un error con el mensaje del backend.
        throw new Error(response.data.message || 'Error en el login');
      } catch (error: any) {
        console.error('Inicio de sesión fallido: ', error.response?.data?.message || error.message);
        this.logout(); // Limpia el estado si el login falla
        throw error; // Relanza para que el componente lo maneje
      }
    },
    //Acción para registrar a un usuario nuevo
    async register(userData: any) {
      try {
        const response = await api.post('/register', userData);
        //Si el registro es correcto y hay token los guarda
        if (response.data.success && response.data.data.token) {
          const { user, token } = response.data.data;
          this.user = user;
          this.token = token;
          this.isAuthenticated = true;

          const storage = new Storage();
          await storage.create();
          await storage.set('auth_token', token);
          return true;
        }
        //Si no lanza el error
        throw new Error(response.data.message || 'Error en el registro');
      } catch (error: any) {
        console.error('Registrao fallido:', error.response?.data?.message || error.message);
        this.logout();
        throw error;
      }
    },
    //Acción para cerrar sesión
    async logout() {
      try {
        if (this.token) {
          await api.post('/logout'); // Llama al endpoint de logout del backend
        }
      } catch (error) {
        console.error('Error durante el cierre de sesión:', error);
        // Se limpia el estado y se borra el token del storage
      } finally {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        const storage = new Storage();
        await storage.create();
        await storage.remove('auth_token');
      }
    },
    //Acción para obtener los datos del usuario autenticado
    async fetchUser() {
      if (!this.isAuthenticated) {
        return;
      } 
      try {
        const response = await api.get('/user');
        if (response.data.success) {
          this.user = response.data.data;
        } else {
          // Si el token ya no es válido hace logout.
          await this.logout();
        }
      } catch (error) {
        console.error('Fallo para obtener los datos de usuario:', error);
        await this.logout(); // Si falla, desloguear
      }
    },
    // Acción para actualizar perfil
    async updateUserProfile(profileData: { name?: string; email?: string }) {
        if (!this.isAuthenticated) throw new Error("Usuario no autenticado.");
        try {
            const response = await api.put('/user/profile', profileData);
            if (response.data.success && response.data.data.user) {
                this.user = response.data.data.user;
                return response.data.data.user;
            }
            throw new Error(response.data.message || 'Error al actualizar el perfil');
        } catch (error: any) {
            console.error('Error al actualizar el perfil:', error.response?.data?.message || error.message);
            throw error;
        }
    }
  }
});
