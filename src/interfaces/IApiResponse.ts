export interface IApiResponse<T> {
    success: boolean;
    message: string;    
    data: any; // Puede ser un objeto, un array, etc.
}