import { IChapter } from "./IChapter";
import { INovel } from "./INovel";
import { IUser } from "./IUser";

export interface INovelDetail extends INovel{
    creator?: IUser;
    chapters?: IChapter[];
    created_at: string;
}


