import { IApiResponse } from "@/interfaces/IApiResponse";
import { INovel } from "@/interfaces/INovel";
import api from "./ApiService";
import { INovelDetail } from "@/interfaces/INovelDetail";


export default class FavouriteService{
    
    
    //Función para agregar favoritos. Teniendo en cuenta el backend, en este caso T (tipo de data), es {novel: INovelDetail}
    static async addNovelFavourites(id:string): Promise<IApiResponse<{  novel?: INovelDetail }>>{
        const response = await api.post<IApiResponse<{ novel: INovelDetail}>>(`/novels/${id}/favourite`);
        return response.data;
    }

    //Función para eliminar favoritos. Teniendo en cuenta el backend, en este caso T (tipo de data), es {novel: INovelDetail}
    static async removeNovelFavourites(id:number): Promise<IApiResponse<null>>{
        const response = await api.delete<IApiResponse<null>>(`/novels/${id}/favourite`);
        return response.data;
    }

    //Función para obtener las novelas favoritas del usuario actualmente autenticado.
    static async getFavouriteNovels(): Promise<IApiResponse<{ favouriteNovels: INovel[]} >> {
        const response = await api.get<IApiResponse<{ favouriteNovels: INovel[] }>>('/favourites');
        return response.data;
    }
 }
