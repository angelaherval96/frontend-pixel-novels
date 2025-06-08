import { IApiResponse } from "@/interfaces/IApiResponse";
import { INovel } from "@/interfaces/INovel";
import api from "./ApiService";
import { INovelDetail } from "@/interfaces/INovelDetail";
import { IChapter} from "@/interfaces/IChapter";
import { ICreatorNovel } from "@/interfaces/ICreatorNovel";



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

    //Función para obtener los detalles de una novela, incluyendo los capítulos.
    static async getNovelDetails(id: string): Promise<IApiResponse<{ novel: INovelDetail, chapters: IChapter[] }>>{
        const response = await api.get<IApiResponse<{ novel: INovelDetail, chapters: IChapter[] }>>(`/novels/${id}/details`);
        return response.data;
    }

    //Función para obtener el contenido de un capítulo específico de una novela.
    static async getChapterContent(novelId: string, chapterId: string): Promise<IApiResponse<{ chapter: IChapter }>>{
        const response = await api.get<IApiResponse<{ chapter: IChapter }>>(`/novels/${novelId}/chapters/${chapterId}`);
        return response.data;
    }



    //AÑADIDAS PARA EL DASHBOARD DE NOVELAS
    //Función que devuelve una lista de novelas creadas por un usuario específico o todas si es el admin
    static async getDashboardNovels():Promise<IApiResponse<{ novels: ICreatorNovel[] }>> {
        const response = await api.get<IApiResponse<{ novels: ICreatorNovel[] }>>(`/dashboard/novels`);
        return response.data;
    }

    //Función para eliminar una novela por su ID
    static async deleteNovel(novelId: string): Promise<IApiResponse<null>> {
        const response = await api.delete<IApiResponse<null>>(`/novels/${novelId}`);
        return response.data;
    }

    //Función para actualizar una novela por su ID
    static async updateNovel(novelId: string, dataNovel: INovel): Promise<IApiResponse<INovel>>{
        const response = await api.put<IApiResponse<INovel>>(`/novels/${novelId}`, dataNovel);
        return response.data;
    }

    //Función para eliminar un capítulo por su ID
    static async deleteChapter(novelId: string, chapterId: string): Promise<IApiResponse<null>> {
        const response = await api.delete<IApiResponse<null>>(`/novels/${novelId}/chapters/${chapterId}`);
        return response.data;
    }

    //Función para crear un capítulo en una novela específica
    static async createChapter(novelId: string, chapterData: Partial<IChapter>): Promise<IApiResponse<{chapter: IChapter}>> {
        const response = await api.post<IApiResponse<{chapter: IChapter}>>(`/novels/${novelId}/chapters`, chapterData);
        return response.data;
    }

    //Función para actualizar un capítulo en una novela específica
    static async updateChapter(novelId: string, chapterId: string, chapterData: Partial<IChapter>): Promise<IApiResponse<IChapter>> {
        const response = await api.put<IApiResponse<IChapter>>(`/novels/${novelId}/chapters/${chapterId}`, chapterData);
        return response.data;
    }
}  
