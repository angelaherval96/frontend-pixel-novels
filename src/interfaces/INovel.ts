//Se define el tipo para que typescript sepa cómo es un objeto de tipo Novel
export interface INovel {
  id?: number; //Opcional porque no se envía al crear
  title: string;
  description: string | null; // Puede ser nulo si no hay descripción
  language: string;
  cover: string;
}