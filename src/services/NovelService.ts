import { IApiResponse } from "@/interfaces/IApiResponse";
import { INovel } from "@/interfaces/INovel";
import api from "./ApiService";


export default class NovelService{
    
    static async obtenerNovelas():Promise<IApiResponse<any>>{ //Datos que se obtendrán de la BD
        const response = await api.get('/novels'); //Se hace la petición a la API
        return response.data; //Se devuelve la respuesta de la API
    } 

    static async createNovel(dataNovel: INovel): Promise<IApiResponse<any>>{
        const response = await api.post('/novels', dataNovel); 
        return response.data; 
    }
 }
