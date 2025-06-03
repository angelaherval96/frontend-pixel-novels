export interface IChapter{
    id: number;
    title: string | null;
    content: string;
    content_type?: 'text' | 'image' | 'video' | 'comic_page' | string;
    novel_id: number;
    order?: number;
    created_at?: string;
    updated_at?: string;

    

   
}