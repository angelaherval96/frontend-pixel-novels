import { IChapter } from "./IChapter";
import { INovel } from "./INovel";

export interface IReading {
    id:number;
    progress: number;
    user_id: number;
    chapter_id: number;
    read_at: string;
    created_at: string;
    updated_at: string;
    //Objeto anidado que contiene la información del capítulo y la novela
    chapter: IChapter & {
        novel: INovel;
    }

}