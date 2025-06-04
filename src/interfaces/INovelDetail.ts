import { IChapter } from "./IChapter";
import { IChapterListItem } from "./IChapterListItem";
import { ICreatorNovel } from "./ICreatorNovel";
import { INovel } from "./INovel";

export interface INovelDetail extends INovel{
    creator?: ICreatorNovel;
    chapters?: IChapterListItem[];
    created_at: string;
}


