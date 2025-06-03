import { IChapter } from "./IChapter";
import { ICreatorNovel } from "./ICreatorNovel";

export interface INovelDetail{
    id: number;
    title: string;
    description: string;
    cover: string;
    creator: ICreatorNovel;
    chapters: IChapter[];
    language: string;
    created_at: string;
}