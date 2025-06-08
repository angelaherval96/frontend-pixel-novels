import { INovel } from "./INovel";
import { IUser } from "./IUser";

export interface ICreatorNovel extends INovel{
    creator?: IUser;
}