import { IChapter } from "./IChapter";
import { ICreatorNovel } from "./ICreatorNovel";
import { INovel } from "./INovel";

export interface INovelDetail extends INovel{
    creator?: ICreatorNovel;
    chapters?: IChapter[];
    created_at: string;
}


