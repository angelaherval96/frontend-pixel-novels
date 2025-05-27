//Se define el tipo para que typescript sepa cómo es un objeto de tipo Novel
export interface INovel {
  id: number;
  title: string;
  description: string;
  language: string;
  cover: string;
}