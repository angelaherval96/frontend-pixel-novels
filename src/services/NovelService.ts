import { IApiResponse } from "@/interfaces/IApiResponse";
import { INovel } from "@/interfaces/INovel";
import api from "./ApiService";
import { INovelDetail } from "@/interfaces/INovelDetail";


export default class NovelService{
    
    static async obtenerNovelas():Promise<IApiResponse<any>>{ //Datos que se obtendrán de la BD
        const response = await api.get('/novels'); //Se hace la petición a la API
        return response.data; //Se devuelve la respuesta de la API
    } 

    static async createNovel(dataNovel: INovel): Promise<IApiResponse<any>>{
        const response = await api.post('/novels', dataNovel); 
        return response.data; 
    }

    //Función para hacer la petición al backend para obtener los datos de una novela en concreto.
    static async getNovelById(id: string): Promise<IApiResponse<{novel: INovelDetail}>>{
        const response = await api.get<IApiResponse<{novel: INovelDetail}>>(`/novels/${id}`);
        return response.data;
    }

    //Función para agregar favoritos. Teniendo en cuenta el backend, en este caso T (tipo de data), es {novel: INovelDetail}
    static async addNovelFavourites(id:string): Promise<IApiResponse<{  novel?: INovelDetail }>>{
        const response = await api.post<IApiResponse<{ novel: INovelDetail}>>(`/novels/${id}/favourite`);
        return response.data;
    }
 }
