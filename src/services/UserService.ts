import api from "./ApiService";
import { IApiResponse } from '@/interfaces/IApiResponse';
import { IUser } from '../interfaces/IUser';

export default class UserService {

    // Función para obtener todos los usuarios
    static async getAllUsers(): Promise<IApiResponse<{ users: IUser[] }>> {
        const response = await api.get<IApiResponse<{ users: IUser[] }>>('/dashboard/users');
        return response.data;
    }

    // Función para eliminar un usuario por su ID
    static async deleteUser(userId: string): Promise<IApiResponse<null>> {
        const response = await api.delete<IApiResponse<null>>(`/dashboard/users/${userId}`);
        return response.data;
    }

    //Función para enviar la url del avatar y actualizar el usuario
    static async setUserAvatar(avatarUrl: string): Promise<IApiResponse<{user: IUser}>> {
        const response = await api.post<IApiResponse<{user: IUser}>>('/user/avatar', { avatar_url: avatarUrl });
        return response.data;
    }

    
}