import { IApiResponse } from "@/interfaces/IApiResponse";
import { IReading } from "@/interfaces/IReading";
import api from "./ApiService";

export default class ReadingService {
    //Función para guardar o actualizar el progreso de lectura de un capítulo.
    static async saveReadingProgress(chapterId: string, progress: number): Promise<IApiResponse<{ reading: IReading }>>{
        const response = await api.post<IApiResponse<{ reading: IReading }>>(`/chapters/${chapterId}/read`, {
            progress: progress,
        });
        return response.data;
    }
}